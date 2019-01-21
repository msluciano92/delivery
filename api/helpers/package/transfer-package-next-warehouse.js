module.exports = {

    friendlyName: 'Transfer package next warehouse',

    description: '',

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
        const arrDestinationsOrder = inputs.arrDestinations;
        const ind = inputs.i;
        const warehouseNext = inputs.warehouse;
        const packageReceived = inputs.package;
        const iNext = ind + 1;
        if (iNext < arrDestinationsOrder.length) {
            const distanceCityFirst = arrDestinationsOrder[ind].distance;
            const distanceCityNext = arrDestinationsOrder[iNext].distance;
            const resultDistance = distanceCityNext - distanceCityFirst;
            const priceKm = 0.2; // lo dejo fijo ... (price = 1 USD * 5 km)
            const penality = 70; // lo dejo fijo ... (70 USD X Day's)
            if ((resultDistance * priceKm) < penality) {
                return exits.success(await sails.helpers.package.sendWarehouse.with({ package: packageReceived, warehouse: warehouseNext }));
            }
        }
        return exits.success(false);
    },
};
