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
            const warehouseNext = inputs.warehouse;
            const newPackage = inputs.package;
            const distanceCityFirst = arrDestinations[ind].distance;
            const distanceCityNext = arrDestinations[iNext].distance;
            const resultDistance = distanceCityNext - distanceCityFirst;
            const priceKm = 0.2; //  ... (price = 1 USD * 5 km)
            const penality = 70; //  ... (70 USD X Day)
            if ((resultDistance * priceKm) < penality) {
                return exits.success(await sails.helpers.package.sendWarehouse.with({ package: newPackage, warehouse: warehouseNext }));
            }
        }
        return exits.success(false);
    },
};
