package com.fitpulse.repository;

import com.fitpulse.model.FitnessChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface FitnessChallengeRepository extends JpaRepository<FitnessChallenge, Long> {
    List<FitnessChallenge> findByEndDateAfterOrderByStartDateAsc(LocalDateTime now);
    List<FitnessChallenge> findAllByOrderByStartDateDesc();
    long countByEndDateAfter(LocalDateTime now);
}
