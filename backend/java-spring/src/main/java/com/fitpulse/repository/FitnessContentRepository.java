package com.fitpulse.repository;

import com.fitpulse.model.FitnessContent;
import com.fitpulse.model.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FitnessContentRepository extends JpaRepository<FitnessContent, Long> {
    Page<FitnessContent> findByStatusOrderByCreatedAtDesc(ContentStatus status, Pageable pageable);
    long countByStatus(ContentStatus status);
}
