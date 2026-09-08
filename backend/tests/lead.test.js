import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import { initDb } from '../src/config/db.js';
import config from '../src/config/index.js';

describe('Leads Tracking API Test Suite', () => {
  let authToken = '';
  let testLeadId = null;

  beforeAll(async () => {
    await initDb();
    // Login to obtain JWT accessToken
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: config.DEV_ADMIN_EMAIL,
        password: config.DEV_ADMIN_PASSWORD,
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);
    expect(loginRes.body.data.accessToken).toBeDefined();
    authToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('Authentication Tests', () => {
    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: config.DEV_ADMIN_EMAIL,
          password: 'WrongPassword!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should fetch user profile when authenticated', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(config.DEV_ADMIN_EMAIL);
    });

    it('should reject access without token', async () => {
      const res = await request(app).get('/api/leads');
      expect(res.status).toBe(401);
    });
  });

  describe('Leads CRUD & Filtering Tests', () => {
    it('should fetch paginated list of leads', async () => {
      const res = await request(app)
        .get('/api/leads?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toBeDefined();
      expect(res.body.meta.page).toBe(1);
    });

    it('should search leads by name or email', async () => {
      // First get any lead
      const listRes = await request(app)
        .get('/api/leads?limit=1')
        .set('Authorization', `Bearer ${authToken}`);
      
      const searchTarget = listRes.body.data[0]?.name?.split(' ')[0] || 'Aarav';

      const res = await request(app)
        .get(`/api/leads?search=${encodeURIComponent(searchTarget)}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      expect(res.body.data.some((l) => l.name.toLowerCase().includes(searchTarget.toLowerCase()))).toBe(true);
    });

    it('should filter leads by status', async () => {
      const res = await request(app)
        .get('/api/leads?status=qualified')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      res.body.data.forEach((lead) => {
        expect(lead.status).toBe('qualified');
      });
    });

    it('should validate email format when creating lead', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Invalid',
          email: 'invalid-email-address',
          phone: '+91 9999999999',
          status: 'new',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should create a new lead successfully', async () => {
      const res = await request(app)
        .post('/api/leads')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Vikramaditya Roy',
          email: 'vikram.roy@domain.com',
          phone: '+91 9888877777',
          status: 'new',
          source: 'Direct Interview Test',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Vikramaditya Roy');
      expect(res.body.data.id).toBeDefined();
      testLeadId = res.body.data.id;
    });

    it('should get lead by id', async () => {
      const res = await request(app)
        .get(`/api/leads/${testLeadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(testLeadId);
    });

    it('should return 404 for non-existent lead', async () => {
      const nonExistentId = new mongoose.Types.ObjectId().toString();
      const res = await request(app)
        .get(`/api/leads/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });

    it('should update lead status and details', async () => {
      const res = await request(app)
        .patch(`/api/leads/${testLeadId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'contacted',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe('contacted');
    });
  });

  describe('Notes per Lead Tests', () => {
    it('should add a note to a lead', async () => {
      const res = await request(app)
        .post(`/api/leads/${testLeadId}/notes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: 'Called customer today and discussed pricing packages.',
        });

      expect(res.status).toBe(201);
      expect(res.body.data.content).toBe('Called customer today and discussed pricing packages.');
      expect(String(res.body.data.leadId)).toBe(String(testLeadId));
    });

    it('should fetch notes for a lead', async () => {
      const res = await request(app)
        .get(`/api/leads/${testLeadId}/notes`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('should reject adding note with empty content', async () => {
      const res = await request(app)
        .post(`/api/leads/${testLeadId}/notes`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          content: '',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Cleanup / Delete Tests', () => {
    it('should delete a lead', async () => {
      const res = await request(app)
        .delete(`/api/leads/${testLeadId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
    });
  });
});
