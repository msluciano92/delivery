describe('POST /package/create-package', () => {
    it('Return package received and tranferred. ', async (done) => {
        app
            .post('/package/create-package')
            .send({ date_send: '2019-01-10', gps: 'La Plata, Buenos Aires, Argentina' })
            .except(201)
            .end(async (err) => {
                if (err) throw err;
                except(201).toBe();
            });
    });
});
