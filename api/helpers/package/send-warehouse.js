module.exports = {

    friendlyName: 'Transfer',

    description: 'Transfer package.',

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
        const updPackage = await Package.updateOne({ id: inputs.package.id }).set({ state: 'In warehouse', warehouse_id: inputs.warehouse.id });
        if (updPackage !== undefined) {
            const cant = inputs.warehouse.cant + 1;
            const updWarehouse = await Warehouse.updateOne({ id: inputs.warehouse.id }).set({ cant });
            if (updWarehouse !== undefined) {
                return exits.success(true);
            }
        }
        return exits.success(false);
    },
};
