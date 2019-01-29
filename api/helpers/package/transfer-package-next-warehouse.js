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
        warehouse: {
            type: 'ref',
        },
        package: {
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
            if ((resultDistance * priceKm) < penality && (warehouse.cantPackages < warehouse.limite)) {
                const newPackage = inputs.package;
                return exits.success(await sails.helpers.package.sendWarehouse.with({ warehouse, package: newPackage }));
            }
        }
        return exits.success(false);
    },
};
