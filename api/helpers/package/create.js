module.exports = {

    friendlyName: 'Create',

    description: 'Create a package.',

    inputs: {
        city: {
            type: 'string',
        },
        date_send_package: {
            type: 'string',
        },
    },

    exits: {

        success: {
            description: 'All done.',
        },

    },

    async fn(inputs, exits) {
        const origin = inputs.city;
        const dateSend = inputs.date_send_package;
        const newPackage = await Package.create({ date_send: dateSend, city: origin }).fetch();
        if (newPackage !== undefined) {
            return exits.success({ isCreatedPackage: true, newPackage });
        }
        return exits.success({ isCreatedPackage: false });
    },
};
