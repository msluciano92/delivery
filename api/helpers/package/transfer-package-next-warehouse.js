module.exports = {

    friendlyName: 'Transfer package next warehouse',

    description: 'Transfer package to next warehouse, why first satured.',

    inputs: {
        arrDestinations: {
            type: 'ref',
        },
        i: {
            type: 'number',
        },
        package: {
            type: 'ref',
        },
        warehouse: {
            type: 'ref',
        },
    },

    exits: {
        success: {
            description: 'All done.',
        },
    },

    async fn(inputs, exits) {
        const arrDestinations = [...inputs.arrDestinations];
        const ind = inputs.i;
        const iNext = ind + 1;
        if (iNext < arrDestinations.length) {
            const warehouse = { ...inputs.warehouse };
            const distanceCityFirst = arrDestinations[ind].distance;
            const distanceCityNext = arrDestinations[iNext].distance;
            const resultDistance = distanceCityNext - distanceCityFirst;
            const priceKm = 0.2; //  ... (price = 1 USD * 5 km)
            const penality = 70; //  ... (70 USD X Day)
            // ... calcula si le conviene  multa
            if ((resultDistance * priceKm) < penality && (warehouse.cant < warehouse.limite)) {
                // ... Paga multa, a menos que no tenga lugar físico ..
                const newPackage = inputs.package;
                return exits.success(await sails.helpers.package.sendWarehouse.with({ package: newPackage, warehouse }));
            }
        }
        return exits.success(false);
    },
};
