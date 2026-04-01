const request = require('supertest');
const app = require('../app');

/**
 * Basic Smoke Test for the Car API
 * We are checking if the endpoint is reachable and returns the expected status.
 */
describe('Car API Endpoints', () => {
  
  // Test #1: GET /api/cars
  it('should fetch all cars successfully', async () => {
    const res = await request(app).get('/api/cars');
    
    // We expect a 200 OK status
    if (res.statusCode !== 200) console.log('❌ Error Body:', res.body);
    expect(res.statusCode).toEqual(200);
    
    // We expect the JSON body to have success: true
    expect(res.body).toHaveProperty('success', true);
  });

  // Test #2: Root Health Check
  it('should return health check message', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('Cars API is running');
  });

});
