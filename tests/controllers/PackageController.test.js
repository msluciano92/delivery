const sails = require('sails');

describe('POST /package/create-send-package', () => {
    beforeEach((done) => {
        app.post('/warehouse').send({
            id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cantPackages: 0,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cantPackages: 0,
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

    it('Return package transfer and create. Warehouse propierty cantPackages add one.', (done) => {
        app
            .get('/warehouse/2')
            .end((err, res) => {
                if (err) throw err;
                expect(0).toBe(res.body.cantPackages);
                app
                    .post('/package/create-send-package')
                    .send({ dateSend: '2019-01-01', city: 'La Plata, Buenos Aires, Argentina' })
                    .expect(201)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(201).toBe(res.body.status);
                        expect('¡Package received and tranferred!').toBe(res.body.message);
                        app
                            .get('/warehouse/2')
                            .end((err, res) => {
                                if (err) throw err;
                                expect(1).toBe(res.body.cantPackages);
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
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(400).toBe(res.body.status);
                        expect('Missing parameters. Or invalid numbers parameters').toBe(res.body.message);
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
                    .send({ dateSend: '2018-11-02' })
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(400).toBe(res.body.status);
                        expect('Missing parameters. Or invalid numbers parameters').toBe(res.body.message);
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
                    .expect(400)
                    .end((err, res) => {
                        if (err) throw err;
                        expect(400).toBe(res.body.status);
                        expect('Missing parameters. Or invalid numbers parameters').toBe(res.body.message);
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
            id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cantPackages: 4,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cantPackages: 3,
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
                    .send({ dateSend: '2019-01-01', city: 'La Plata, Buenos Aires, Argentina' })
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
            id: 1, dateSend: '2018-12-12', city: 'Rosario, Argentina', state: 'In warehouse', warehouseId: 1,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cantPackages: 1,
            }).end((err) => {
                if (err) throw err;
                app.post('/warehouse').send({
                    id: 2, codigo: 'WHO2', city: 'Buenos Aires, Argentina', limite: 3, cantPackages: 1,
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

    it('Return is package send. Warehouse propierty cantPackages substract one.', (done) => {
        app
            .get('/warehouse/1')
            .end((err, res) => {
                if (err) throw err;
                expect(1).toBe(res.body.cantPackages);
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
                                expect(0).toBe(res.body.cantPackages);
                                done();
                            });
                    });
            });
    });

    it('Return error, loading package. ', (done) => {
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
                expect('Indicate package. Check count parameters. ').toBe(res.body.message);
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
                expect('Indicate package. Check count parameters. ').toBe(res.body.message);
                done();
            });
    });
});

describe('PUT /package/send-package - special case, warehouseId in package undefined', () => {
    beforeEach((done) => {
        app.post('/package').send({
            id: 1, dateSend: '2018-12-12', city: 'Rosario, Argentina', state: 'In warehouse', warehouseId: 3,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 1, codigo: 'WHO1', city: 'Córdoba, Argentina', limite: 4, cantPackages: 1,
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

    it('Return error, loading warehouse. Warehouse cantPackages not modify.', (done) => {
        app
            .get('/warehouse/1')
            .end((err, res) => {
                if (err) throw err;
                expect(1).toBe(res.body.cantPackages);
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
                                expect(1).toBe(res.body.cantPackages);
                                done();
                            });
                    });
            });
    });
});

describe('PUT /package/send-package - Send package when invalid state', () => {
    beforeEach((done) => {
        app.post('/package').send({
            id: 1, dateSend: '2018-12-12', city: 'Rosario, Argentina', state: 'In destination', warehouseId: 1,
        }).end((err) => {
            if (err) throw err;
            app.post('/warehouse').send({
                id: 1, cod: 'WH01', city: 'Buenos Aires, Argentina', limite: 5, cantPackages: 2,
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

    it('Return error, loading package. Invalid state. Warehouse cantPackages not modify.', (done) => {
        app
            .get('/warehouse/1')
            .end((err, res) => {
                if (err) throw err;
                expect(2).toBe(res.body.cantPackages);
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
                                expect(2).toBe(res.body.cantPackages);
                                done();
                            });
                    });
            });
    });
});
