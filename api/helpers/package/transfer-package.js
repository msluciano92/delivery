module.exports = {

    friendlyName: 'Transfer package',

    description: 'Transfer package to warehouse',

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
        const warehouse = { ...inputs.warehouse };
        const newPackage = inputs.package;
        if (warehouse !== undefined) {
            let cumple = true;
            if (warehouse.cant > 0) {
                cumple = ((Math.round(warehouse.limite * 0.95)) > warehouse.cant);
            }
            if (cumple) {
                return exits.success(await sails.helpers.package.sendWarehouse.with({ package: newPackage, warehouse }));
            }
        }
        return exits.success(false);
    },
};
