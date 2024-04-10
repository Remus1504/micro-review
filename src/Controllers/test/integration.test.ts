// integration.test.js

const request = require('supertest');
const express = require('express');
const { start } = require('../../server');
const { appRoutes } = require('../../endpoints');

const app = express();
start(app);
appRoutes(app);

describe('Integration Tests', () => {
  it('should respond with 404 status for health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(404);
  });

  it('should respond with 404 status for invalid route', async () => {
    const response = await request(app).get('/invalid-route');
    expect(response.status).toBe(404);
  });

  it('should return course reviews by course id', async () => {
    const courseId = '123456';
    const response = await request(app).get(
      `/api/v1/review/course/${courseId}`,
    );
    expect(response.status).toBe(200);
  });

  it('should return course reviews by instructor id', async () => {
    const instructorId = '7890'; // Replace with a valid instructor id
    const response = await request(app).get(
      `/api/v1/review/instructor/${instructorId}`,
    );
    expect(response.status).toBe(200);
  });

  it('should create a new review', async () => {
    const reviewData = {
      // Add review data here
    };
    const response = await request(app).post('/api/v1/review').send(reviewData);
    expect(response.status).toBe(200);
  });
});
