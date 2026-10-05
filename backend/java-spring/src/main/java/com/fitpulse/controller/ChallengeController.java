package com.fitpulse.controller;

import com.fitpulse.dto.ApiResponse;
import com.fitpulse.dto.ChallengeDtos.ChallengeResponse;
import com.fitpulse.dto.ChallengeDtos.UserChallengeResponse;
import com.fitpulse.model.User;
import com.fitpulse.model.enums.ChallengeStatus;
import com.fitpulse.service.AuthService;
import com.fitpulse.service.ChallengeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/challenges")
@Tag(name = "Challenges & Holographic Badges", description = "Endpoints for challenge enrollment and medal tracking")
public class ChallengeController {

    private final ChallengeService challengeService;
    private final AuthService authService;

    public ChallengeController(ChallengeService challengeService, AuthService authService) {
        this.challengeService = challengeService;
        this.authService = authService;
    }

    @GetMapping
    @Operation(summary = "List all available challenges")
    public ResponseEntity<ApiResponse<List<ChallengeResponse>>> getChallenges() {
        User user = null;
        try {
            user = authService.getCurrentAuthenticatedUser();
        } catch (Exception ignored) {}

        List<ChallengeResponse> list = challengeService.getAvailableChallenges(user);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PostMapping("/{id}/join")
    @Operation(summary = "Enroll current athlete into an active challenge")
    public ResponseEntity<ApiResponse<UserChallengeResponse>> joinChallenge(@PathVariable Long id) {
        User user = authService.getCurrentAuthenticatedUser();
        UserChallengeResponse response = challengeService.joinChallenge(user, id);
        return ResponseEntity.ok(ApiResponse.ok(response, "Enrolled in challenge successfully"));
    }

    @GetMapping("/my")
    @Operation(summary = "Get current athlete's active or completed challenges")
    public ResponseEntity<ApiResponse<List<UserChallengeResponse>>> getMyChallenges(
            @RequestParam(required = false) ChallengeStatus status) {
        User user = authService.getCurrentAuthenticatedUser();
        List<UserChallengeResponse> list = challengeService.getMyChallenges(user, status);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }
}
