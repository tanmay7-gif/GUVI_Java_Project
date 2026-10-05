package com.fitpulse.controller;

import com.fitpulse.dto.ApiResponse;
import com.fitpulse.dto.ContentDtos.ContentResponse;
import com.fitpulse.dto.ContentDtos.ModerationRequest;
import com.fitpulse.model.SystemSetting;
import com.fitpulse.model.User;
import com.fitpulse.model.enums.Role;
import com.fitpulse.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator Governance & Telemetry", description = "RBAC-restricted endpoints for platform overview, user management, and settings")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get administrator platform KPIs and node telemetry")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        Map<String, Object> kpis = adminService.getAdminKpis();
        return ResponseEntity.ok(ApiResponse.ok(kpis));
    }

    @GetMapping("/users")
    @Operation(summary = "Get paginated user directory with search")
    public ResponseEntity<ApiResponse<Page<User>>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = adminService.getUsers(search, pageable);
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role privilege level")
    public ResponseEntity<ApiResponse<User>> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        User updated = adminService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.ok(updated, "User role successfully elevated/demoted"));
    }

    @PostMapping("/content/{id}/moderate")
    @Operation(summary = "Approve or reject community guide submission")
    public ResponseEntity<ApiResponse<ContentResponse>> moderateContent(
            @PathVariable Long id,
            @Valid @RequestBody ModerationRequest request) {
        ContentResponse response = adminService.moderateContent(id, request);
        return ResponseEntity.ok(ApiResponse.ok(response, "Content status updated"));
    }

    @PostMapping("/settings")
    @Operation(summary = "Update global system configuration parameter")
    public ResponseEntity<ApiResponse<SystemSetting>> updateSetting(
            @RequestParam String key,
            @RequestParam String value) {
        SystemSetting setting = adminService.updateSetting(key, value);
        return ResponseEntity.ok(ApiResponse.ok(setting, "System setting calibrated"));
    }
}
