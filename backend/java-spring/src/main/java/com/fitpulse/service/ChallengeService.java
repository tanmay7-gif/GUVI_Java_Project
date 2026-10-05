package com.fitpulse.service;

import com.fitpulse.dto.ChallengeDtos.*;
import com.fitpulse.exception.BadRequestException;
import com.fitpulse.exception.ResourceNotFoundException;
import com.fitpulse.model.FitnessChallenge;
import com.fitpulse.model.User;
import com.fitpulse.model.UserChallenge;
import com.fitpulse.model.WorkoutLog;
import com.fitpulse.model.enums.ChallengeStatus;
import com.fitpulse.repository.FitnessChallengeRepository;
import com.fitpulse.repository.UserChallengeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ChallengeService {

    private final FitnessChallengeRepository challengeRepository;
    private final UserChallengeRepository userChallengeRepository;

    public ChallengeService(FitnessChallengeRepository challengeRepository,
                            UserChallengeRepository userChallengeRepository) {
        this.challengeRepository = challengeRepository;
        this.userChallengeRepository = userChallengeRepository;
    }

    @Transactional(readOnly = true)
    public List<ChallengeResponse> getAvailableChallenges(User currentUser) {
        List<FitnessChallenge> challenges = challengeRepository.findAllByOrderByStartDateDesc();
        Map<Long, UserChallenge> myEnrolled = currentUser != null
                ? userChallengeRepository.findByUser(currentUser).stream()
                    .collect(Collectors.toMap(uc -> uc.getChallenge().getId(), uc -> uc))
                : Collections.emptyMap();

        return challenges.stream().map(c -> {
            ChallengeResponse dto = new ChallengeResponse();
            dto.setId(c.getId());
            dto.setTitle(c.getTitle());
            dto.setDescription(c.getDescription());
            dto.setTargetMetric(c.getTargetMetric());
            dto.setTargetValue(c.getTargetValue());
            dto.setStartDate(c.getStartDate());
            dto.setEndDate(c.getEndDate());
            dto.setRewardBadge(c.getRewardBadge());

            UserChallenge uc = myEnrolled.get(c.getId());
            if (uc != null) {
                dto.setJoined(true);
                dto.setProgressPercent(uc.getProgressPercentage());
            } else {
                dto.setJoined(false);
                dto.setProgressPercent(0);
            }
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public UserChallengeResponse joinChallenge(User user, Long challengeId) {
        FitnessChallenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ResourceNotFoundException("Challenge not found: " + challengeId));

        if (userChallengeRepository.findByUserAndChallenge(user, challenge).isPresent()) {
            throw new BadRequestException("You have already enrolled in this endurance challenge.");
        }

        UserChallenge uc = new UserChallenge(user, challenge);
        UserChallenge saved = userChallengeRepository.save(uc);
        return mapToUserChallengeResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<UserChallengeResponse> getMyChallenges(User user, ChallengeStatus status) {
        List<UserChallenge> list = status != null
                ? userChallengeRepository.findByUserAndStatus(user, status)
                : userChallengeRepository.findByUser(user);

        return list.stream().map(this::mapToUserChallengeResponse).collect(Collectors.toList());
    }

    @Transactional
    public void processWorkoutForChallenges(User user, WorkoutLog workout) {
        List<UserChallenge> active = userChallengeRepository.findByUserAndStatus(user, ChallengeStatus.IN_PROGRESS);

        for (UserChallenge uc : active) {
            FitnessChallenge fc = uc.getChallenge();
            int increment = 0;

            switch (fc.getTargetMetric()) {
                case CALORIES -> increment = workout.getCaloriesBurned();
                case DURATION -> increment = workout.getDurationMinutes();
                case WORKOUT_COUNT -> increment = 1;
            }

            int newProgress = uc.getCurrentProgress() + increment;
            uc.setCurrentProgress(newProgress);

            if (newProgress >= fc.getTargetValue()) {
                uc.setStatus(ChallengeStatus.COMPLETED);
                uc.setCompletedAt(LocalDateTime.now());
            }

            userChallengeRepository.save(uc);
        }
    }

    private UserChallengeResponse mapToUserChallengeResponse(UserChallenge uc) {
        UserChallengeResponse dto = new UserChallengeResponse();
        dto.setId(uc.getId());
        dto.setStatus(uc.getStatus());
        dto.setCurrentProgress(uc.getCurrentProgress());
        dto.setProgressPercentage(uc.getProgressPercentage());
        dto.setCompletedAt(uc.getCompletedAt());

        FitnessChallenge c = uc.getChallenge();
        ChallengeResponse cr = new ChallengeResponse();
        cr.setId(c.getId());
        cr.setTitle(c.getTitle());
        cr.setDescription(c.getDescription());
        cr.setTargetMetric(c.getTargetMetric());
        cr.setTargetValue(c.getTargetValue());
        cr.setStartDate(c.getStartDate());
        cr.setEndDate(c.getEndDate());
        cr.setRewardBadge(c.getRewardBadge());
        cr.setJoined(true);
        cr.setProgressPercent(uc.getProgressPercentage());

        dto.setChallenge(cr);
        return dto;
    }
}
