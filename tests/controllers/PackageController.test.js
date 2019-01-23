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

    it('Return package transfer and create. Warehouse propierty cant add one.', (done) => {
        app
            .get('/warehouse/2')
            .end((err, res) => {
                if (err) throw err;
                expect(0).toBe(res.body.cant);
                app
                    .post('/package/create-send-package')
                    .send({ date_send: '2019-01-01', city: 'La Plata, Buenos Aires, Argentina' })
                    .expect(201)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(201).toBe(res.body.status);
                        expect('¡Package received and tranferred!').toBe(res.body.message);
                        app
                            .get('/warehouse/2')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(1).toBe(res.body.cant);
                                done();
                            });
                    });
            });
    });

    it('Return error in database, empty date_send parameter. Numbers of packages unmodifield.', (done) => {
        app
            .get('/package')
            .end((err, res) => {
                if (err) throw err;
                expect(0).toBe(res.body.length);
                app
                    .post('/package/create-send-package')
                    .send({ city: 'La Plata, Buenos Aires, Argentina' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(500).toBe(res.body.status);
                        expect('E_INVALID_NEW_RECORD').toBe(res.body.message);
                        app
                            .get('/package')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(0).toBe(res.body.length);
                                done();
                            });
                    });
            });
    });

    it('Return error in database, empty city parameter.  Numbers of packages unmodifield.', (done) => {
        app
            .get('/package')
            .end((err, res) => {
                if (err) throw err;
                expect(0).toBe(res.body.length);
                app
                    .post('/package/create-send-package')
                    .send({ date_send: '2018-11-02' })
                    .expect(500)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(500).toBe(res.body.status);
                        expect('E_INVALID_NEW_RECORD').toBe(res.body.message);
                        app
                            .get('/package')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(0).toBe(res.body.length);
                                done();
                            });
                    });
            });
    });

    it('Return error in database, empty parameters', (done) => {
        app
            .get('/package')
            .end((err, res) => {
                if (err) throw err;
                expect(0).toBe(res.body.length);
                app
                    .post('/package/create-send-package')
                    .expect(500)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(500).toBe(res.body.status);
                        expect('E_INVALID_NEW_RECORD').toBe(res.body.message);
                        app
                            .get('/package')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(0).toBe(res.body.length);
                                done();
                            });
                    });
            });
    });
});

describe('POST /package/create-send-package - special case, satured warehouses ', () => {
    beforeEach((done) => {
        app.post('/warehouse').send({
            id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cant: 4,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cant: 3,
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

    it('Return error when transfer package.  Numbers of packages unmodifield.', (done) => {
        app
            .get('/package')
            .end((err, res) => {
                if (err) throw err;
                expect(0).toBe(res.body.length);
                app
                    .post('/package/create-send-package')
                    .send({ date_send: '2019-01-01', city: 'La Plata, Buenos Aires, Argentina' })
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(400).toBe(res.body.status);
                        expect('Error receiving the package in warehouse').toBe(res.body.message);
                        app
                            .get('/package')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(0).toBe(res.body.length);
                                done();
                            });
                    });
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
                id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cant: 1,
            }).end((err) => {
                if (err) throw err;
                app.post('/warehouse').send({
                    id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cant: 1,
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

    it('Return is package send. Warehouse propierty cant substract one.', (done) => {
        app
            .get('/warehouse/1')
            .end((err, res) => {
                if (err) throw err;
                expect(1).toBe(res.body.cant);
                app
                    .put('/package/send-package')
                    .send({ id: 1 })
                    .expect(200)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(200).toBe(res.body.status);
                        expect('¡Package sent to destination!').toBe(res.body.message);
                        app
                            .get('/warehouse/1')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(0).toBe(res.body.cant);
                                done();
                            });
                    });
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

describe('PUT /package/send-package - special case, warehouse_id in package undefined', () => {
    beforeEach((done) => {
        app.post('/package').send({
            id: 1, date_send: '2018-12-12', city: 'Rosario, Argentina', state: 'In warehouse', warehouse_id: 3,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cant: 1,
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

    it('Return error, loading warehouse. Warehouse cant not modify.', (done) => {
        app
            .get('/warehouse/1')
            .end((err, res) => {
                if (err) throw err;
                expect(1).toBe(res.body.cant);
                app
                    .put('/package/send-package')
                    .send({ id: 1 })
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(400).toBe(res.body.status);
                        expect('Error loading warehouse').toBe(res.body.message);
                        app
                            .get('/warehouse/1')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(1).toBe(res.body.cant);
                                done();
                            });
                    });
            });
    });
});

describe('PUT /package/send-package - Send package when invalid state', () => {
    beforeEach((done) => {
        app.post('/package').send({
            id: 1, date_send: '2018-12-12', city: 'Rosario, Argentina', state: 'In destination', warehouse_id: 1,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 1, cod: 'WH01', city: 'Buenos Aires, Argentina', limite: 5, cant: 2,
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

    it('Return error loading package. Invalid state. Warehouse cant not modify.', (done) => {
        app
            .get('/warehouse/1')
            .end((err, res) => {
                if (err) throw err;
                expect(2).toBe(res.body.cant);
                app
                    .put('/package/send-package')
                    .send({ id: 1 })
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;
                        expect('Error loading package').toBe(res.body.message);
                        app
                            .get('/warehouse/1')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(2).toBe(res.body.cant);
                                done();
                            });
                    });
            });
    });
});
