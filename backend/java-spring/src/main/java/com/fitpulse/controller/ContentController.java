package com.fitpulse.controller;

import com.fitpulse.dto.ApiResponse;
import com.fitpulse.dto.ContentDtos.ContentCreateRequest;
import com.fitpulse.dto.ContentDtos.ContentResponse;
import com.fitpulse.model.User;
import com.fitpulse.service.AuthService;
import com.fitpulse.service.ContentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/content")
@Tag(name = "Community Conditioning Guides", description = "Endpoints for community workout guides and nutrition protocols")
public class ContentController {

    private final ContentService contentService;
    private final AuthService authService;

    public ContentController(ContentService contentService, AuthService authService) {
        this.contentService = contentService;
        this.authService = authService;
    }

    @PostMapping
    @Operation(summary = "Submit new community guide for peer review")
    public ResponseEntity<ApiResponse<ContentResponse>> submitContent(@Valid @RequestBody ContentCreateRequest request) {
        User creator = authService.getCurrentAuthenticatedUser();
        ContentResponse response = contentService.submitContent(creator, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Guide submitted successfully"));
    }

    @GetMapping
    @Operation(summary = "Get paginated approved community guides")
    public ResponseEntity<ApiResponse<Page<ContentResponse>>> getApprovedContent(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContentResponse> result = contentService.getApprovedContent(pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/{id}/upvote")
    @Operation(summary = "Upvote a community guide")
    public ResponseEntity<ApiResponse<ContentResponse>> upvoteContent(@PathVariable Long id) {
        ContentResponse response = contentService.upvoteContent(id);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
