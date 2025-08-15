// Add automated testing
const request = require('supertest');
const app = require('../backend/server');
const { getDbConnection } = require('../backend/db');

describe('Authentication API', () => {
    let db;

    beforeAll(async () => {
        db = await getDbConnection();
    });

    afterAll(async () => {
        await db.close();
    });

    beforeEach(async () => {
        await db.run('DELETE FROM users');
    });

    test('should register a new user', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'Test123!'
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('email');
    });

    test('should not register user with invalid password', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'weak'
            });
        expect(res.statusCode).toBe(400);
    });
}); 