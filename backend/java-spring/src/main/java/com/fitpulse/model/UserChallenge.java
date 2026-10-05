package com.fitpulse.model;

import com.fitpulse.model.enums.ChallengeStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_challenges", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_challenge", columnNames = {"user_id", "challenge_id"})
})
public class UserChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "challenge_id", nullable = false)
    private FitnessChallenge challenge;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ChallengeStatus status = ChallengeStatus.IN_PROGRESS;

    @NotNull
    @Column(name = "current_progress", nullable = false)
    private Integer currentProgress = 0;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public UserChallenge() {}

    public UserChallenge(User user, FitnessChallenge challenge) {
        this.user = user;
        this.challenge = challenge;
        this.status = ChallengeStatus.IN_PROGRESS;
        this.currentProgress = 0;
    }

    public int getProgressPercentage() {
        if (challenge == null || challenge.getTargetValue() <= 0) return 0;
        return Math.min(100, Math.round(((float) currentProgress / challenge.getTargetValue()) * 100));
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public FitnessChallenge getChallenge() { return challenge; }
    public void setChallenge(FitnessChallenge challenge) { this.challenge = challenge; }

    public ChallengeStatus getStatus() { return status; }
    public void setStatus(ChallengeStatus status) { this.status = status; }

    public Integer getCurrentProgress() { return currentProgress; }
    public void setCurrentProgress(Integer currentProgress) { this.currentProgress = currentProgress; }

    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
}
