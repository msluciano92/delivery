module.exports = {
    async createPackageAndSendWarehouse(req, res) {
        try {
            const input = req.body;
            const isSendPackageWarehouse = await sails.helpers.warehouse.sendPackageWarehouse.with({ city: input.city, date_send_package: input.date_send });
            if (isSendPackageWarehouse) {
                res.status(201).json({ status: 201, message: '¡Package received and tranferred!' });
            } else {
                res.status(400).json({ status: 400, message: 'Error receiving the package in warehouse' });
            }
        } catch (e) {
            res.status(500).json({ status: 500, message: e.code });
        }
    },

    async sendPackageDestination(req, res) {
        try {
            if (req.body.id !== undefined) {
                const packageToSend = await Package.findOne({ id: req.body.id });
                if (packageToSend !== undefined) {
                    const warehouse = await Warehouse.findOne({ id: packageToSend.warehouse_id });
                    if (warehouse !== undefined) {
                        const isSentPackageDestination = await sails.helpers.package.sendDestination.with({ warehouse, package: packageToSend });
                        if (isSentPackageDestination) {
                            res.status(200).json({ status: 200, message: '¡Package sent to destination!' });
                        } else {
                            res.status(400).json({ status: 400, message: 'Error sending package destination' });
                        }
                    } else {
                        res.status(400).json({ status: 400, message: 'Error loading warehouse' });
                    }
                } else {
                    res.status(400).json({ status: 400, message: 'Error loading package' });
                }
            } else {
                res.status(400).json({ status: 400, message: 'Indicate package' });
            }
        } catch (e) {
            res.status(500);
        }
    },
};
