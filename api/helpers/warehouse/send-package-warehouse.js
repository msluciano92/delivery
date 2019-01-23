module.exports = {

    friendlyName: 'Send package warehouse',

    description: 'Create a package and transfer to warehouse',

    inputs: {
        city: {
            type: 'string',
        },
        date_send_package: {
            type: 'string',
        },
    },

    exits: {

        success: {
            description: 'All done.',
        },
    },

    async fn(inputs, exits) {
        let isSendPackage = false;
        const origin = inputs.city;
        const dateSend = inputs.date_send_package;
        const { isCreatedPackage, newPackage } = await sails.helpers.package.create.with({ city: origin, date_send_package: dateSend });
        const resp = {};
        resp.status = 400;
        resp.message = 'Error receiving the package in warehouse';
        if (isCreatedPackage) {
            let i = 0;
            const { result, arrDestinations } = await sails.helpers.distance.distanceMatrix.with({ origin });
            while (result && i < arrDestinations.length && !isSendPackage) {
                const cityFirst = arrDestinations[i].city;
                const warehouse = await Warehouse.findOne({ city: cityFirst });
                isSendPackage = await sails.helpers.package.transferPackage.with({ package: newPackage, warehouse });
                if (!isSendPackage && ((i + 1) < arrDestinations.length)) {
                    isSendPackage = await sails.helpers.package.transferPackageNextWarehouse.with(
                        {
                            arrDestinations,
                            i,
                            warehouse,
                            package: newPackage,
                        },
                    );
                }
                i += 1;
            }
            if (!isSendPackage) {
                await Package.destroyOne({ id: newPackage.id });
            } else {
                resp.status = 201;
                resp.message = '¡Package received and tranferred!';
            }
        }
        return exits.success(resp);
    },
};
