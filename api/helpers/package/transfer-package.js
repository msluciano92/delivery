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
        if (warehouse !== undefined && warehouse.cant < warehouse.limite) {
            let cumple = true;
            if (warehouse.cant > 0) {
                cumple = ((Math.round(warehouse.limite * 0.95)) > warehouse.cant);
            }
            if (cumple) {
                const newPackage = inputs.package;
                return exits.success(await sails.helpers.package.sendWarehouse.with({ warehouse, package: newPackage }));
            }
        }
        return exits.success(false);
    },
};
