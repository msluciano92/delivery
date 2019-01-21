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
        const warehouseFirst = inputs.warehouse;
        const packageReceived = inputs.package;
        const updPackage = await Package.updateOne({ id: packageReceived.id }).set({ state: 'In destination' });
        if (updPackage !== undefined) {
            const cant = warehouseFirst.cant - 1;
            const updWarehouse = await Warehouse.updateOne({ id: warehouseFirst.id }).set({ cant });
            if (updWarehouse !== undefined) {
                return exits.success(true);
            }
        }
        return exits.success(false);
    },

};
