module.exports = {

    friendlyName: 'Send destination',

    description: '',

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
        const warehouseDestination = inputs.warehouse;
        const packageToSend = inputs.package;
        const updPackage = await Package.updateOne({ id: packageToSend.id }).set({ state: 'In destination' });
        if (updPackage !== undefined) {
            const cant = warehouseDestination.cant - 1;
            const updWarehouse = await Warehouse.updateOne({ id: warehouseDestination.id }).set({ cant });
            if (updWarehouse !== undefined) {
                return exits.success(true);
            }
        }
        return exits.success(false);
    },

};
