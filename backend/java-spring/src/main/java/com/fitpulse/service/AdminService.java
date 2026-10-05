package com.fitpulse.service;

import com.fitpulse.dto.ContentDtos.ContentResponse;
import com.fitpulse.dto.ContentDtos.ModerationRequest;
import com.fitpulse.exception.ResourceNotFoundException;
import com.fitpulse.model.FitnessContent;
import com.fitpulse.model.SystemSetting;
import com.fitpulse.model.User;
import com.fitpulse.model.enums.ContentStatus;
import com.fitpulse.model.enums.Role;
import com.fitpulse.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final WorkoutLogRepository workoutLogRepository;
    private final FitnessContentRepository contentRepository;
    private final FitnessChallengeRepository challengeRepository;
    private final SystemSettingRepository systemSettingRepository;

    public AdminService(UserRepository userRepository,
                        WorkoutLogRepository workoutLogRepository,
                        FitnessContentRepository contentRepository,
                        FitnessChallengeRepository challengeRepository,
                        SystemSettingRepository systemSettingRepository) {
        this.userRepository = userRepository;
        this.workoutLogRepository = workoutLogRepository;
        this.contentRepository = contentRepository;
        this.challengeRepository = challengeRepository;
        this.systemSettingRepository = systemSettingRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminKpis() {
        Map<String, Object> kpis = new HashMap<>();

        long totalUsers = userRepository.count();
        long workoutsToday = workoutLogRepository.countWorkoutsToday(LocalDate.now().atStartOfDay());
        long pendingApprovals = contentRepository.countByStatus(ContentStatus.PENDING);
        long activeChallenges = challengeRepository.countByEndDateAfter(LocalDateTime.now());

        kpis.put("totalUsers", totalUsers);
        kpis.put("activeWorkoutsToday", workoutsToday);
        kpis.put("pendingContentApprovals", pendingApprovals);
        kpis.put("ongoingChallenges", activeChallenges);

        return kpis;
    }

    @Transactional(readOnly = true)
    public Page<User> getUsers(String query, Pageable pageable) {
        if (query != null && !query.isBlank()) {
            return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable);
        }
        return userRepository.findAll(pageable);
    }

    @Transactional
    public User updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        user.setRole(newRole);
        return userRepository.save(user);
    }

    @Transactional
    public ContentResponse moderateContent(Long contentId, ModerationRequest request) {
        FitnessContent content = contentRepository.findById(contentId)
                .orElseThrow(() -> new ResourceNotFoundException("Content not found: " + contentId));

        content.setStatus(request.getAction());
        FitnessContent saved = contentRepository.save(content);

        ContentResponse res = new ContentResponse();
        res.setId(saved.getId());
        res.setTitle(saved.getTitle());
        res.setStatus(saved.getStatus());
        return res;
    }

    @Transactional
    public SystemSetting updateSetting(String key, String value) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(key)
                .orElse(new SystemSetting(key, value));
        setting.setSettingValue(value);
        setting.setUpdatedAt(LocalDateTime.now());
        return systemSettingRepository.save(setting);
    }
}
