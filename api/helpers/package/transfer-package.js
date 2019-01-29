module.exports = {

    friendlyName: 'Transfer package',

    description: 'Check condition the warehouse for send package.',

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
        if (warehouse !== undefined && warehouse.cantPackages < warehouse.limite) {
            let cumple = true;
            if (warehouse.cantPackages > 0) {
                cumple = ((Math.round(warehouse.limite * 0.95)) > warehouse.cantPackages);
            }
            if (cumple) {
                const newPackage = inputs.package;
                return exits.success(await sails.helpers.package.sendWarehouse.with({ warehouse, package: newPackage }));
            }
        }
        return exits.success(false);
    },
};
