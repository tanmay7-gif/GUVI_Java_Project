package com.fitpulse.model;

import com.fitpulse.model.enums.Intensity;
import com.fitpulse.model.enums.WorkoutType;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "workout_logs", indexes = {
    @Index(name = "idx_workout_user", columnList = "user_id"),
    @Index(name = "idx_workout_date", columnList = "logged_at")
})
public class WorkoutLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "workout_type", nullable = false, length = 30)
    private WorkoutType workoutType;

    @NotNull
    @Min(1)
    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Intensity intensity;

    @NotNull
    @Min(0)
    @Column(name = "calories_burned", nullable = false)
    private Integer caloriesBurned;

    @NotNull
    @Column(name = "logged_at", nullable = false)
    private LocalDateTime loggedAt;

    @Column(length = 1000)
    private String notes;

    public WorkoutLog() {}

    public WorkoutLog(User user, WorkoutType workoutType, Integer durationMinutes,
                      Intensity intensity, Integer caloriesBurned, LocalDateTime loggedAt, String notes) {
        this.user = user;
        this.workoutType = workoutType;
        this.durationMinutes = durationMinutes;
        this.intensity = intensity;
        this.caloriesBurned = caloriesBurned;
        this.loggedAt = loggedAt != null ? loggedAt : LocalDateTime.now();
        this.notes = notes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public WorkoutType getWorkoutType() { return workoutType; }
    public void setWorkoutType(WorkoutType workoutType) { this.workoutType = workoutType; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public Intensity getIntensity() { return intensity; }
    public void setIntensity(Intensity intensity) { this.intensity = intensity; }

    public Integer getCaloriesBurned() { return caloriesBurned; }
    public void setCaloriesBurned(Integer caloriesBurned) { this.caloriesBurned = caloriesBurned; }

    public LocalDateTime getLoggedAt() { return loggedAt; }
    public void setLoggedAt(LocalDateTime loggedAt) { this.loggedAt = loggedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
