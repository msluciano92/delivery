module.exports = {

    friendlyName: 'Transfer package',

    description: '',

    inputs: {
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
        const warehouseFirst = inputs.warehouse;
        const packageReceived = inputs.package;
        if (warehouseFirst !== undefined) {
            let cumple = true;
            if (warehouseFirst.cant > 0) {
                cumple = ((Math.round(warehouseFirst.limite * 0.95)) > warehouseFirst.cant);
            }
            if (cumple) {
                return exits.success(await sails.helpers.package.sendWarehouse.with({ package: packageReceived, warehouse: warehouseFirst }));
            }
        }
        return exits.success(false);
    },
};
