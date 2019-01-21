const sails = require('sails');

describe('POST /package/create-send-package', () => {
    beforeEach((done) => {
        app.post('/warehouse').send({
            id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cant: 0,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cant: 0,
            }).end((err) => {
                if (err) throw err;
                done();
            });
        });
    });

    afterEach(async (done) => {
        await sails.models.package.destroy({}).fetch();
        await sails.models.warehouse.destroy({}).fetch();
        done();
    });

    it('Return package tranfer and create', (done) => {
        app
            .post('/package/create-send-package')
            .send({ date_send: '2019-01-01', city: 'La Plata, Buenos Aires, Argentina' })
            .expect(201)
            .end((err, res) => {
                if (err) throw err;
                expect(201).toBe(res.body.status);
                expect('¡Package received and tranferred!').toBe(res.body.message);
                done();
            });
    });

    it('Return error database', (done) => {
        app
            .post('/package/create-send-package')
            .send({ city: 'La Plata, Buenos Aires, Argentina' })
            .expect(500)
            .end((err, res) => {
                if (err) throw err;
                expect(500).toBe(res.body.status);
                expect('E_INVALID_NEW_RECORD').toBe(res.body.message);
                done();
            });
    });

    it('Return error database', (done) => {
        app
            .post('/package/create-send-package')
            .send({ date_send: '2018-11-02' })
            .expect(500)
            .end((err, res) => {
                if (err) throw err;
                expect(500).toBe(res.body.status);
                expect('E_INVALID_NEW_RECORD').toBe(res.body.message);
                done();
            });
    });
});


describe('PUT /package/send-package', () => {
    beforeEach((done) => {
        app.post('/package').send({
            id: 1, date_send: '2018-12-12', city: 'Rosario, Argentina', state: 'In warehouse', warehouse_id: 1,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cant: 0,
            }).end((err) => {
                if (err) throw err;
                app.post('/warehouse').send({
                    id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cant: 0,
                }).end((err) => {
                    if (err) throw err;
                    done();
                });
            });
        });
    });

    afterEach(async (done) => {
        await sails.models.package.destroy({}).fetch();
        await sails.models.warehouse.destroy({}).fetch();
        done();
    });

    it('Return is package send. ', (done) => {
        app
            .put('/package/send-package')
            .send({ id: 1 })
            .expect(200)
            .end((err, res) => {
                if (err) throw err;
                expect(200).toBe(res.body.status);
                expect('¡Package send to destination!').toBe(res.body.message);
                done();
            });
    });


    it('Return error loading package. ', (done) => {
        app
            .put('/package/send-package')
            .send({ id: 10 })
            .expect(400)
            .end((err, res) => {
                if (err) throw err;
                expect(400).toBe(res.body.status);
                expect('Error loading package').toBe(res.body.message);
                done();
            });
    });


    it('Return indicate package. ', (done) => {
        app
            .put('/package/send-package')
            .send({ id: undefined })
            .expect(400)
            .end((err, res) => {
                if (err) throw err;
                expect(400).toBe(res.body.status);
                expect('Indicate package').toBe(res.body.message);
                done();
            });
    });

    it('Return indicate package. ', (done) => {
        app
            .put('/package/send-package')
            .expect(400)
            .end((err, res) => {
                if (err) throw err;
                expect(400).toBe(res.body.status);
                expect('Indicate package').toBe(res.body.message);
                done();
            });
        });
});
