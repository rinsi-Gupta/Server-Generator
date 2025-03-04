const request = require('supertest');
const app = require('../server.js');

test("Test Login Route", async () => {
    const response = await request(app).post('/login');
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Login successful");
});
