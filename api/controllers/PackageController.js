module.exports = {
    async createPackageAndSendWarehouse(req, res) {
        try {
            const input = req.body;
            if (input.city !== undefined && input.dateSend !== undefined && Object.keys(input).length === 2) {
                const { status, message } = await sails.helpers.warehouse.sendPackageWarehouse.with({ city: input.city, dateSendPackage: input.dateSend });
                res.status(status).json({ status, message });
            } else {
                res.status(400).json({ status: 400, message: 'Missing parameters. Or invalid numbers parameters' });
            }
        } catch (e) {
            res.status(500).json({ status: 500, message: e.code });
        }
    },

    async sendPackageDestination(req, res) {
        try {
            const input = req.body;
            if (input.id !== undefined && Object.keys(input).length === 1) {
                const { status, message } = await sails.helpers.package.sendPackageDestination.with({ packageId: input.id });
                res.status(status).json({ status, message });
            } else {
                res.status(400).json({ status: 400, message: 'Indicate package. Check count parameters. ' });
            }
        } catch (e) {
            res.status(500);
        }
    },

};
