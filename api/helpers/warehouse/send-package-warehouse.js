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
        let ok = false;
        const origin = inputs.city;
        const dateSend = inputs.date_send_package;
        const packageCreate = await sails.helpers.package.create.with({ city: origin, date_send_package: dateSend });
        if (packageCreate.created) {
            const packageCreated = packageCreate.package;
            const arrDestinations = await sails.helpers.distance.distanceMatrix.with({ origin });
            while (i < arrDestinations.length && !ok) {
                const cityFirst = arrDestinations[i].city;
                const warehouse = await Warehouse.findOne({ city: cityFirst });
                ok = await sails.helpers.package.transferPackage.with({ package: packageCreated, warehouse });
                if (!ok) {
                    ok = await sails.helpers.package.transferPackageNextWarehouse.with(
                        {
                            arrDestinations,
                            i,
                            package: packageCreated,
                            warehouse,
                        },
                    );
                }
                i += 1;
            }
            if (!ok) {
                await Package.delete({ id: packageCreate.package.id });
            }
        }
        return exits.success(ok);
    },
};
