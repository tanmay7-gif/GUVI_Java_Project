package com.fitpulse.service;

import com.fitpulse.dto.WorkoutDtos.WorkoutCreateRequest;
import com.fitpulse.dto.WorkoutDtos.WorkoutResponse;
import com.fitpulse.exception.BadRequestException;
import com.fitpulse.exception.ResourceNotFoundException;
import com.fitpulse.model.User;
import com.fitpulse.model.WorkoutLog;
import com.fitpulse.model.enums.WorkoutType;
import com.fitpulse.repository.WorkoutLogRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class WorkoutService {

    private final WorkoutLogRepository workoutLogRepository;
    private final AuthService authService;
    private final ChallengeService challengeService;

    public WorkoutService(WorkoutLogRepository workoutLogRepository,
                          AuthService authService,
                          ChallengeService challengeService) {
        this.workoutLogRepository = workoutLogRepository;
        this.authService = authService;
        this.challengeService = challengeService;
    }

    @Transactional
    public WorkoutResponse logWorkout(WorkoutCreateRequest request) {
        User user = authService.getCurrentAuthenticatedUser();

        LocalDateTime loggedTime = request.getLoggedAt() != null ? request.getLoggedAt() : LocalDateTime.now();

        WorkoutLog log = new WorkoutLog(
                user,
                request.getWorkoutType(),
                request.getDurationMinutes(),
                request.getIntensity(),
                request.getCaloriesBurned(),
                loggedTime,
                request.getNotes()
        );

        WorkoutLog saved = workoutLogRepository.save(log);

        // Increment challenge progress automatically
        challengeService.processWorkoutForChallenges(user, saved);

        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<WorkoutResponse> getMyWorkouts(WorkoutType type, Pageable pageable) {
        User user = authService.getCurrentAuthenticatedUser();
        Page<WorkoutLog> page;

        if (type != null) {
            page = workoutLogRepository.findByUserAndWorkoutTypeOrderByLoggedAtDesc(user, type, pageable);
        } else {
            page = workoutLogRepository.findByUserOrderByLoggedAtDesc(user, pageable);
        }

        return page.map(this::mapToResponse);
    }

    @Transactional
    public void deleteWorkout(Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        WorkoutLog log = workoutLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Workout record not found: " + id));

        if (!log.getUser().getId().equals(user.getId()) && user.getRole() != com.fitpulse.model.enums.Role.ADMIN) {
            throw new BadRequestException("Unauthorized to delete another athlete's workout telemetry");
        }

        workoutLogRepository.delete(log);
    }

    private WorkoutResponse mapToResponse(WorkoutLog log) {
        return new WorkoutResponse(
                log.getId(),
                log.getWorkoutType(),
                log.getDurationMinutes(),
                log.getIntensity(),
                log.getCaloriesBurned(),
                log.getLoggedAt(),
                log.getNotes()
        );
    }
}
