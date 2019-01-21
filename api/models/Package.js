module.exports = {

    attributes: {
        state: {
            type: 'string',
            defaultsTo: 'Received',
        },
        date_send: {
            type: 'string',
            required: true,
        },
        gps: {
            type: 'string',
            required: true,
        },
        warehouse_id: {
            type: 'number',
        },
    },
};
