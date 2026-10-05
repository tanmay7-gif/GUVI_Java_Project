package com.fitpulse.service;

import com.fitpulse.dto.WorkoutDtos.WorkoutCreateRequest;
import com.fitpulse.dto.WorkoutDtos.WorkoutResponse;
import com.fitpulse.model.User;
import com.fitpulse.model.WorkoutLog;
import com.fitpulse.model.enums.Intensity;
import com.fitpulse.model.enums.Role;
import com.fitpulse.model.enums.WorkoutType;
import com.fitpulse.repository.WorkoutLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class WorkoutServiceTest {

    @Mock
    private WorkoutLogRepository workoutLogRepository;

    @Mock
    private AuthService authService;

    @Mock
    private ChallengeService challengeService;

    @InjectMocks
    private WorkoutService workoutService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = new User("Sarah Connor", "sarah@fitpulse.com", "hash", Role.USER, "avatar.png");
        mockUser.setId(1L);
    }

    @Test
    void testLogWorkout_Success() {
        WorkoutCreateRequest request = new WorkoutCreateRequest();
        request.setWorkoutType(WorkoutType.STRENGTH);
        request.setDurationMinutes(60);
        request.setIntensity(Intensity.HIGH);
        request.setCaloriesBurned(550);
        request.setNotes("Heavy Leg Day");

        when(authService.getCurrentAuthenticatedUser()).thenReturn(mockUser);
        when(workoutLogRepository.save(any(WorkoutLog.class))).thenAnswer(invocation -> {
            WorkoutLog log = invocation.getArgument(0);
            log.setId(100L);
            return log;
        });

        WorkoutResponse response = workoutService.logWorkout(request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(WorkoutType.STRENGTH, response.getType());
        assertEquals(60, response.getDurationMinutes());
        assertEquals(550, response.getCaloriesBurned());

        // Verify challenge progression was invoked
        verify(challengeService, times(1)).processWorkoutForChallenges(eq(mockUser), any(WorkoutLog.class));
        verify(workoutLogRepository, times(1)).save(any(WorkoutLog.class));
    }
}
