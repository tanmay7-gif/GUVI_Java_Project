package com.fitpulse.repository;

import com.fitpulse.model.User;
import com.fitpulse.model.WorkoutLog;
import com.fitpulse.model.enums.Intensity;
import com.fitpulse.model.enums.WorkoutType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WorkoutLogRepository extends JpaRepository<WorkoutLog, Long> {

    Page<WorkoutLog> findByUserOrderByLoggedAtDesc(User user, Pageable pageable);

    Page<WorkoutLog> findByUserAndWorkoutTypeOrderByLoggedAtDesc(User user, WorkoutType workoutType, Pageable pageable);

    List<WorkoutLog> findByUserAndLoggedAtBetweenOrderByLoggedAtAsc(User user, LocalDateTime start, LocalDateTime end);

    @Query("SELECT COUNT(w) FROM WorkoutLog w WHERE w.loggedAt >= :startOfDay")
    long countWorkoutsToday(@Param("startOfDay") LocalDateTime startOfDay);

    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0) FROM WorkoutLog w WHERE w.user = :user AND w.loggedAt >= :since")
    int sumCaloriesSince(@Param("user") User user, @Param("since") LocalDateTime since);

    @Query("SELECT COALESCE(SUM(w.durationMinutes), 0) FROM WorkoutLog w WHERE w.user = :user AND w.loggedAt >= :since")
    int sumDurationSince(@Param("user") User user, @Param("since") LocalDateTime since);

    @Query("SELECT COALESCE(SUM(w.caloriesBurned), 0) FROM WorkoutLog w WHERE w.user = :user")
    int sumTotalCalories(@Param("user") User user);

    @Query("SELECT COALESCE(SUM(w.durationMinutes), 0) FROM WorkoutLog w WHERE w.user = :user")
    int sumTotalDuration(@Param("user") User user);

    long countByUser(User user);
}
