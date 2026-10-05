package com.fitpulse.model;

import com.fitpulse.model.enums.TargetMetric;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

@Entity
@Table(name = "fitness_challenges")
public class FitnessChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 150)
    private String title;

    @Column(length = 1000)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "target_metric", nullable = false, length = 30)
    private TargetMetric targetMetric;

    @NotNull
    @Column(name = "target_value", nullable = false)
    private Integer targetValue;

    @NotNull
    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    @NotNull
    @Column(name = "end_date", nullable = false)
    private LocalDateTime endDate;

    @Column(name = "badge_icon_url", length = 500)
    private String badgeIconUrl;

    @Column(name = "reward_badge", length = 100)
    private String rewardBadge;

    public FitnessChallenge() {}

    public FitnessChallenge(String title, String description, TargetMetric targetMetric,
                            Integer targetValue, LocalDateTime startDate, LocalDateTime endDate,
                            String badgeIconUrl, String rewardBadge) {
        this.title = title;
        this.description = description;
        this.targetMetric = targetMetric;
        this.targetValue = targetValue;
        this.startDate = startDate;
        this.endDate = endDate;
        this.badgeIconUrl = badgeIconUrl;
        this.rewardBadge = rewardBadge;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TargetMetric getTargetMetric() { return targetMetric; }
    public void setTargetMetric(TargetMetric targetMetric) { this.targetMetric = targetMetric; }

    public Integer getTargetValue() { return targetValue; }
    public void setTargetValue(Integer targetValue) { this.targetValue = targetValue; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public String getBadgeIconUrl() { return badgeIconUrl; }
    public void setBadgeIconUrl(String badgeIconUrl) { this.badgeIconUrl = badgeIconUrl; }

    public String getRewardBadge() { return rewardBadge; }
    public void setRewardBadge(String rewardBadge) { this.rewardBadge = rewardBadge; }
}
