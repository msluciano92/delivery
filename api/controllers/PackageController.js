module.exports = {
    async createPackage(req, res) {
        try {
            const arrDestinationsOrder = await sails.helpers.distance.distanceMatrix.with({ origin: req.body.gps });
            if (arrDestinationsOrder !== undefined && arrDestinationsOrder.length > 0) {
                const input = req.body;
                const packageReceived = await Package.create({ date_send: input.date_send, gps: input.gps }).fetch();
                if (packageReceived !== undefined) {
                    let i = 0;
                    let ok = false;
                    while (i < arrDestinationsOrder.length && !ok) {
                        const cityFirst = arrDestinationsOrder[i].city;
                        const warehouse = await Warehouse.findOne({ city: cityFirst });
                        ok = await sails.helpers.package.transferPackage.with({ package: packageReceived, warehouse });
                        if (!ok) {
                            ok = await sails.helpers.package.transferPackageNextWarehouse.with(
                                {
                                    arrDestinationsOrder,
                                    i,
                                    package: packageReceived,
                                    warehouse,
                                },
                            );
                        }
                        i += 1;
                    }
                    if (ok) {
                        res.status(200).json({ status: 200, message: '¡Package received and tranferred!' });
                    } else {
                        res.status(400).json({ status: 400, message: 'Error receiving the package' });
                    }
                } else {
                    res.status(400).json({ status: 400, message: 'Error at created package' });
                }
            } else {
                res.status(400).json({ status: 400, message: 'Destinations undefined or empty' });
            }
        } catch (e) {
            res.status(500);
        }
    },

    async sendPackage(req, res) {
        try {
            if (req.body.id !== undefined) {
                const packageReceived = await Package.findOne({ id: req.body.id });
                if (packageReceived !== undefined) {
                    const warehouse = await Warehouse.findOne({ id: packageReceived.warehouse_id });
                    if (warehouse !== undefined) {
                        const cant = warehouse.cant - 1;
                        const updWarehouse = await Warehouse.updateOne({ id: warehouse.id }).set({ cant });
                        if (updWarehouse !== undefined) {
                            const updPackage = await Package.updateOne({ id: packageReceived.id }).set({ state: 'Send' });
                            if (updPackage !== undefined) {
                                res.status(200).json('¡Package send!');
                            } else {
                                res.status(400).json('Error update package');
                            }
                        } else {
                            res.status(400).json('Error update warehouse');
                        }
                    } else {
                        res.status(400).json('Error loading warehouse');
                    }
                } else {
                    res.status(400).json('Error loading package');
                }
            } else {
                res.status(400).json('Indicate package');
            }
        } catch (e) {
            res.status(500);
        }
    },
};
