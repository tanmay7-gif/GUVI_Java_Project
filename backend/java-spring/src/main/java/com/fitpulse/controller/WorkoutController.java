package com.fitpulse.controller;

import com.fitpulse.dto.ApiResponse;
import com.fitpulse.dto.WorkoutDtos.WorkoutCreateRequest;
import com.fitpulse.dto.WorkoutDtos.WorkoutResponse;
import com.fitpulse.model.enums.WorkoutType;
import com.fitpulse.service.WorkoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/workouts")
@Tag(name = "Workouts & Conditioning", description = "Endpoints for logging and auditing training sessions")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    @PostMapping
    @Operation(summary = "Log new conditioning or hypertrophy session")
    public ResponseEntity<ApiResponse<WorkoutResponse>> logWorkout(@Valid @RequestBody WorkoutCreateRequest request) {
        WorkoutResponse response = workoutService.logWorkout(request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Workout logged and challenges incremented"));
    }

    @GetMapping
    @Operation(summary = "Get paginated workout history with optional discipline filter")
    public ResponseEntity<ApiResponse<Page<WorkoutResponse>>> getMyWorkouts(
            @RequestParam(required = false) WorkoutType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<WorkoutResponse> result = workoutService.getMyWorkouts(type, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete workout session log")
    public ResponseEntity<ApiResponse<Void>> deleteWorkout(@PathVariable Long id) {
        workoutService.deleteWorkout(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Workout log deleted successfully"));
    }
}
