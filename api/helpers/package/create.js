module.exports = {

    friendlyName: 'Create',

    description: 'Create a package.',

    inputs: {
        city: {
            type: 'string',
        },
        dateSendPackage: {
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
        const dateSend = inputs.dateSendPackage;
        const newPackage = await Package.create({ dateSend, city: origin }).fetch();
        if (newPackage !== undefined) {
            return exits.success({ isCreatedPackage: true, newPackage });
        }
        return exits.success({ isCreatedPackage: false });
    },
};
