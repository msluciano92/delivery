const distance = require('google-distance-matrix');

module.exports = {

    friendlyName: 'Distance matrix',

    description: 'returns the distance between two or more locations',

    inputs: {
        origin: {
            type: 'string',
            description: '',
        },
    },

    async fn(inputs, exits) {
        const origins = [inputs.origin];
        const warehouses = await Warehouse.find({});
        const destinations = warehouses.map((warehouse) => {
            const elem = warehouse.city;
            return elem;
        });
        const apiKey = 'AIzaSyCx7mYJLJRDPdyynRdX4UGQBY79NTtQXYM';
        distance.key(apiKey);

        await distance.matrix(origins, destinations, (err, distances) => {
            if (!err && distances.status === 'OK') {
                if (distances === undefined) {
                    return exits.success(-1);
                }
                if (distances.rows[0].elements[0].distance === undefined) {
                    return exits.success(-1);
                }
                const arrDestinationsOrder = [];
                let ind = 0;
                distances.rows[0].elements.forEach((elem) => {
                    if (elem.status === 'OK') {
                        arrDestinationsOrder.push(
                            {
                                city: destinations[ind],
                                distance: elem.distance,
                            },
                        );
                    }
                    ind += 1;
                });
                return exits.success(arrDestinationsOrder.sort((a, b) => {
                    return parseFloat(a.distance.value) > parseFloat(b.distance.value);
                }));
            }
            return exits.success(false);
        });
    },
};
