module.exports = {


    friendlyName: 'Create',


    description: 'Create package.',


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
        const packageReceived = await Package.create({ date_send: dateSend, gps: origin }).fetch();
        if (packageReceived !== undefined) {
            return exits.success({ created: true, package: packageReceived });
        }
        return exits.success({ created: false, package: undefined });
    },

};
