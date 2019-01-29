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
        const warehouse = { ...inputs.warehouse };
        const packageToSend = inputs.package;
        const updPackage = await Package.updateOne({ id: packageToSend.id }).set({ state: 'In destination' });
        if (updPackage !== undefined) {
            const cantPackages = warehouse.cantPackages - 1;
            const updWarehouse = await Warehouse.updateOne({ id: warehouse.id }).set({ cantPackages });
            if (updWarehouse !== undefined) {
                return exits.success(true);
            }
        }
        return exits.success(false);
    },

};
