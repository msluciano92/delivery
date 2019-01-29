module.exports = {

    friendlyName: 'Transfer',

    description: 'Transfer package.',

    inputs: {
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
        const newPackage = inputs.package;
        const warehouse = { ...inputs.warehouse };
        const updPackage = await Package.updateOne({ id: newPackage.id }).set({ state: 'In warehouse', warehouse_id: warehouse.id });
        if (updPackage !== undefined) {
            const cantPackages = warehouse.cantPackages + 1;
            const updWarehouse = await Warehouse.updateOne({ id: warehouse.id }).set({ cantPackages });
            if (updWarehouse !== undefined) {
                return exits.success(true);
            }
        }
        return exits.success(false);
    },
};
