module.exports = {


    friendlyName: 'Send package warehouse',


    description: '',


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
        let i = 0;
        let isSendPackage = false;
        const origin = inputs.city;
        const dateSend = inputs.date_send_package;
        const packageCreate = await sails.helpers.package.create.with({ city: origin, date_send_package: dateSend });
        const createdPackage = packageCreate.created;
        const newPackage = packageCreate.package;
        if (createdPackage) {
            const arrDestinations = await sails.helpers.distance.distanceMatrix.with({ origin });
            while (i < arrDestinations.length && !isSendPackage) {
                const cityFirst = arrDestinations[i].city;
                const warehouse = await Warehouse.findOne({ city: cityFirst });
                isSendPackage = await sails.helpers.package.transferPackage.with({ package: newPackage, warehouse });
                if (!isSendPackage) {
                    if ((i + 1) < arrDestinations.length) {
                        isSendPackage = await sails.helpers.package.transferPackageNextWarehouse.with(
                            {
                                arrDestinations,
                                i,
                                package: newPackage,
                                warehouse,
                            },
                        );
                    }
                }
                i += 1;
            }
            if (!isSendPackage) {
                await Package.destroyOne({ id: newPackage.id });
            }
        }
        return exits.success(isSendPackage);
    },
};
