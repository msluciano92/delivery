const sails = require('sails');
const request = require('supertest');

beforeAll((done) => {
    sails.lift({ log: { level: 'warn' }, hooks: { } }, (err) => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 50000;
        global.app = request(sails.hooks.http.app);
        return done(err, sails);
    });
});

afterAll(sails.lower);
