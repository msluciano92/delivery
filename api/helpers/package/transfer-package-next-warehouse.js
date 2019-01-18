module.exports = {

    friendlyName: 'Transfer package next warehouse',

    description: '',

    inputs: {
        arrDestinationsOrder: {
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
        const arrDestinations = inputs.arrDestinationsOrder;
        const ind = inputs.i;
        const packageReceived = inputs.package;
        const warehouseNext = inputs.warehouse;
        const iNext = ind + 1;
        if (iNext < arrDestinations.length) {
            const distanceCityFirst = arrDestinationsOrder[i].distance;
            const distanceCityNext = arrDestinationsOrder[i + 1].distance;
            const resultDistance = distanceCityNext - distanceCityFirst;
            const priceKm = 0.2; // lo dejo fijo ... (price = 1 USD * 5 km)
            const penality = 70; // lo dejo fijo ... (70 USD X Day's)
            if ((resultDistance * priceKm) < penality) {
                const resp = await sails.helpers.package.transfer.with({ package: packageReceived, warehouse: warehouseNext });
                if (resp) {
                    exits.success(resp);
                }
            }
        }
        exits.success(false);
    },
};
