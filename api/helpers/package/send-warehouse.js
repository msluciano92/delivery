module.exports = {

    friendlyName: 'Send to warehouse',

    description: 'Transfer package received by parameter to the warehouse. Increment availability the warehouse',

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
        const updPackage = await Package.updateOne({ id: newPackage.id }).set({ state: 'In warehouse', warehouseId: warehouse.id });
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
