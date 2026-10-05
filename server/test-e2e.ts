const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting FitPulse Full-Stack Automated Verification...\n');
  let passed = 0;
  let failed = 0;

  const assert = (condition: boolean, testName: string, detail?: any) => {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`, detail || '');
      failed++;
    }
  };

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData: any = await healthRes.json();
  assert(healthRes.status === 200 && healthData.status === 'healthy', 'API Health Check (/api/health)');

  // 2. Auth - Athlete Login
  const sarahLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah@fitpulse.com', password: 'User123!' }),
  });
  const sarahData: any = await sarahLoginRes.json();
  assert(sarahLoginRes.status === 200 && sarahData.success && sarahData.data.token, 'Athlete Login (Sarah)');
  const sarahToken = sarahData.data?.token;

  // 3. Auth - Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@fitpulse.com', password: 'Admin123!' }),
  });
  const adminData: any = await adminLoginRes.json();
  assert(adminLoginRes.status === 200 && adminData.success && adminData.data.user.role === 'ADMIN', 'Admin Login (Marcus)');
  const adminToken = adminData.data?.token;

  // 4. Workout Logging
  const logRes = await fetch(`${BASE_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sarahToken}`,
    },
    body: JSON.stringify({
      type: 'HIIT',
      duration_minutes: 40,
      intensity: 'HIGH',
      calories_burned: 480,
      notes: 'Automated test interval circuit',
    }),
  });
  const logData: any = await logRes.json();
  assert(logRes.status === 201 && logData.success && logData.data.type === 'HIIT', 'Create Workout Log (POST /api/workouts)');
  const newWorkoutId = logData.data?.id;

  // 5. Workout Analytics
  const analyticsRes = await fetch(`${BASE_URL}/workouts/analytics`, {
    headers: { Authorization: `Bearer ${sarahToken}` },
  });
  const analyticsData: any = await analyticsRes.json();
  assert(
    analyticsRes.status === 200 &&
    analyticsData.data.summary.weeklyCaloriesBurned > 0 &&
    analyticsData.data.dailyTrend.length === 7,
    'Workout Analytics Aggregation (GET /api/workouts/analytics)'
  );

  // 6. Challenges Progress
  const challengesRes = await fetch(`${BASE_URL}/challenges`, {
    headers: { Authorization: `Bearer ${sarahToken}` },
  });
  const challengesData: any = await challengesRes.json();
  assert(challengesRes.status === 200 && challengesData.data.length >= 3, 'Fetch Challenges (GET /api/challenges)');

  // 7. Security: RBAC Guard Test (Athlete attempting Admin route)
  const forbiddenRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${sarahToken}` },
  });
  assert(forbiddenRes.status === 403, 'RBAC Security: User blocked from Admin route (403 Forbidden)');

  // 8. Security: Input Validation boundary check (Negative duration)
  const invalidWorkoutRes = await fetch(`${BASE_URL}/workouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sarahToken}`,
    },
    body: JSON.stringify({
      type: 'Running',
      duration_minutes: -15, // Illegal negative duration
      intensity: 'HIGH',
      calories_burned: 150,
    }),
  });
  assert(invalidWorkoutRes.status === 400, 'Input Validation: Rejection of negative duration (400 Bad Request)');

  // 9. Admin Dashboard KPIs & Telemetry
  const adminDashRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminDashData: any = await adminDashRes.json();
  assert(
    adminDashRes.status === 200 &&
    adminDashData.data.kpis.totalUsers >= 3 &&
    adminDashData.data.recentActivity.length > 0,
    'Admin Dashboard Telemetry (GET /api/admin/dashboard)'
  );

  // 10. Admin User Management
  const usersRes = await fetch(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const usersData: any = await usersRes.json();
  assert(usersRes.status === 200 && usersData.data.users.length >= 3, 'Admin User Management Registry (GET /api/admin/users)');

  // 11. Cleanup test workout
  if (newWorkoutId) {
    const deleteRes = await fetch(`${BASE_URL}/workouts/${newWorkoutId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${sarahToken}` },
    });
    assert(deleteRes.status === 200, 'Delete Workout Entry (DELETE /api/workouts/:id)');
  }

  console.log(`\n📊 Verification Summary: ${passed} Passed, ${failed} Failed`);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
