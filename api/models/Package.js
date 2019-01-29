module.exports = {
    attributes: {
        state: {
            type: 'string',
            defaultsTo: 'Received',
        },
        dateSend: {
            type: 'string',
            required: true,
        },
        city: {
            type: 'string',
            required: true,
        },
        warehouseId: {
            type: 'number',
        },
    },
};
