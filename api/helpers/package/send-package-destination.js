module.exports = {


    friendlyName: 'Send package destination',


    description: '',


    inputs: {
        packageId: {
            type: 'number',
        },
    },


    exits: {

        success: {
            description: 'All done.',
        },

    },


    async fn(inputs, exits) {
        const resp = {};
        resp.status = 400;
        const packageToSend = await Package.findOne({ where: { and: [{ id: inputs.packageId }, { state: 'In warehouse' }] } });
        if (packageToSend !== undefined) {
            const warehouse = await Warehouse.findOne({ id: packageToSend.warehouseId });
            if (warehouse !== undefined) {
                const isSentPackageDestination = await sails.helpers.package.sendDestination.with({ warehouse, package: packageToSend });
                if (isSentPackageDestination) {
                    resp.status = 200;
                    resp.message = '¡Package sent to destination!';
                } else {
                    resp.message = 'Error sending package destination';
                }
            } else {
                resp.message = 'Error loading warehouse';
            }
        } else {
            resp.message = 'Error loading package';
        }
        return exits.success(resp);
    },

};
