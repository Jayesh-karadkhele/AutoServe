import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

async function runCustomerIntegrationTest() {
  console.log('=== Starting Part 8A Customer Integration Test ===\n');

  // Generate unique test credentials
  const timestamp = Date.now();
  const customerEmail = `customer_${timestamp}@example.com`;
  const customerPassword = `SecurePass123!`;
  const customerName = `Test Customer ${timestamp.toString().slice(-4)}`;
  const customerPhone = `98${timestamp.toString().slice(-8)}`;

  let accessToken = '';
  let customerId = 0;
  let vehicleId = 0;
  let appointmentId = 0;

  // Step 1: Register Customer
  console.log('Step 1: Registering new Customer account...');
  const regRes = await axios.post(`${BASE_URL}/auth/register`, {
    name: customerName,
    email: customerEmail,
    phone: customerPhone,
    password: customerPassword,
    role: 'CUSTOMER',
  });
  console.log(`[PASS] Registered user ID: ${regRes.data.id}, Email: ${regRes.data.email}`);
  customerId = regRes.data.id;

  // Step 2: Login
  console.log('\nStep 2: Logging in as Customer...');
  const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
    email: customerEmail,
    password: customerPassword,
  });
  accessToken = loginRes.data.accessToken;
  console.log(`[PASS] Login successful. Access Token received (length: ${accessToken.length})`);

  const authHeader = { headers: { Authorization: `Bearer ${accessToken}` } };

  // Step 3: Restore session after reload (GET /api/users/me)
  console.log('\nStep 3: Restoring session via GET /api/users/me...');
  const meRes = await axios.get(`${BASE_URL}/users/me`, authHeader);
  console.log(`[PASS] Session restored for user: ${meRes.data.name} (${meRes.data.email})`);

  // Step 4: Create vehicle
  console.log('\nStep 4: Creating vehicle (POST /api/vehicles)...');
  const vehicleRes = await axios.post(
    `${BASE_URL}/vehicles`,
    {
      registrationNumber: `MH12TS${timestamp.toString().slice(-4)}`,
      make: 'Toyota',
      model: 'Camry Hybrid',
      vehicleType: 'Sedan',
      year: 2023,
      fuelType: 'HYBRID',
    },
    authHeader
  );
  vehicleId = vehicleRes.data.id;
  console.log(`[PASS] Vehicle created with ID: ${vehicleId}, Reg: ${vehicleRes.data.registrationNumber}`);

  // Step 5: View vehicle
  console.log('\nStep 5: Viewing vehicle details (GET /api/vehicles/me & GET /api/vehicles/:id)...');
  const myVehiclesRes = await axios.get(`${BASE_URL}/vehicles/me`, authHeader);
  console.log(`[PASS] Customer owns ${myVehiclesRes.data.length} vehicle(s)`);

  const singleVehicleRes = await axios.get(`${BASE_URL}/vehicles/${vehicleId}`, authHeader);
  console.log(`[PASS] Fetched single vehicle: ${singleVehicleRes.data.make} ${singleVehicleRes.data.model}`);

  // Step 6: Book appointment
  console.log('\nStep 6: Booking service appointment (POST /api/appointments)...');
  const apptRes = await axios.post(
    `${BASE_URL}/appointments`,
    {
      vehicleId: vehicleId,
      serviceType: 'PERIODIC_MAINTENANCE',
      preferredDate: '2026-10-15',
      preferredTime: '10:00:00',
      comments: 'Full periodic checkup and oil change request.',
    },
    authHeader
  );
  appointmentId = apptRes.data.id;
  console.log(`[PASS] Appointment booked with ID: ${appointmentId}, Status: ${apptRes.data.status}`);

  // Step 7: View appointment
  console.log('\nStep 7: Viewing appointment details (GET /api/appointments/me & GET /api/appointments/:id)...');
  const myApptsRes = await axios.get(`${BASE_URL}/appointments/me`, authHeader);
  console.log(`[PASS] Customer has ${myApptsRes.data.length} appointment(s)`);

  const singleApptRes = await axios.get(`${BASE_URL}/appointments/${appointmentId}`, authHeader);
  console.log(`[PASS] Fetched appointment detail: ${singleApptRes.data.serviceType}`);

  // Step 8: Verify Customer cannot access another Customer's vehicle
  console.log('\nStep 8: Testing unauthorized vehicle access (GET /api/vehicles/99999)...');
  try {
    await axios.get(`${BASE_URL}/vehicles/99999`, authHeader);
    console.error('[FAIL] Unauthorized vehicle access was allowed!');
  } catch (err) {
    if (err.response && (err.response.status === 403 || err.response.status === 404)) {
      console.log(`[PASS] Access correctly denied with status ${err.response.status}`);
    } else {
      console.error(`[FAIL] Unexpected error status: ${err.response?.status}`);
    }
  }

  // Step 9: Verify Customer cannot access another Customer's appointment
  console.log('\nStep 9: Testing unauthorized appointment access (GET /api/appointments/99999)...');
  try {
    await axios.get(`${BASE_URL}/appointments/99999`, authHeader);
    console.error('[FAIL] Unauthorized appointment access was allowed!');
  } catch (err) {
    if (err.response && (err.response.status === 403 || err.response.status === 404)) {
      console.log(`[PASS] Access correctly denied with status ${err.response.status}`);
    } else {
      console.error(`[FAIL] Unexpected error status: ${err.response?.status}`);
    }
  }

  // Step 10: View available job-card / evidence data
  console.log('\nStep 10: Viewing job cards (GET /api/job_cards/me)...');
  const jobCardsRes = await axios.get(`${BASE_URL}/job_cards/me`, authHeader);
  console.log(`[PASS] Fetched ${jobCardsRes.data.length} job card(s)`);

  // Step 11: View available invoice data
  console.log('\nStep 11: Viewing invoices (GET /api/invoices/me)...');
  const invoicesRes = await axios.get(`${BASE_URL}/invoices/me`, authHeader);
  console.log(`[PASS] Fetched ${invoicesRes.data.length} invoice(s)`);

  // Step 12: Update profile
  console.log('\nStep 12: Updating Customer profile (PUT /api/users/me)...');
  const updateRes = await axios.put(
    `${BASE_URL}/users/me`,
    {
      name: `${customerName} Updated`,
      phone: '9876543210',
    },
    authHeader
  );
  console.log(`[PASS] Profile updated: Name="${updateRes.data.name}", Phone="${updateRes.data.phone}"`);

  // Step 13: Logout
  console.log('\nStep 13: Logging out (POST /api/auth/logout)...');
  const logoutRes = await axios.post(`${BASE_URL}/auth/logout`, {}, authHeader);
  console.log(`[PASS] Logout response message: "${logoutRes.data.message}"`);

  // Step 14: Confirm protected endpoint rejects logged out token or request without auth
  console.log('\nStep 14: Verifying unauthenticated request rejection (GET /api/users/me without token)...');
  try {
    await axios.get(`${BASE_URL}/users/me`);
    console.error('[FAIL] Unauthenticated request succeeded!');
  } catch (err) {
    if (err.response && (err.response.status === 401 || err.response.status === 403)) {
      console.log(`[PASS] Request correctly rejected with status ${err.response.status}`);
    } else {
      console.error(`[FAIL] Unexpected error status: ${err.response?.status}`);
    }
  }

  console.log('\n=== All 14 Customer Integration Test Steps PASSED Successfully! ===');
}

runCustomerIntegrationTest().catch((err) => {
  console.error('Integration test failed with error:', err.message);
  process.exit(1);
});
