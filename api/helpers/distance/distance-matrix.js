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
        if (inputs.origin !== undefined) {
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
                    if (distances === undefined || distances.rows[0].elements[0].distance === undefined) {
                        return exits.success({ result: false, arrDestinations: [] });
                    }
                    const arrDestinations = [];
                    let ind = 0;
                    distances.rows[0].elements.forEach((elem) => {
                        if (elem.status === 'OK') {
                            arrDestinations.push(
                                {
                                    city: destinations[ind],
                                    distance: elem.distance,
                                },
                            );
                        }
                        ind += 1;
                    });
                    arrDestinations.sort((a, b) => {
                        return parseFloat(a.distance.value) > parseFloat(b.distance.value);
                    });
                    return exits.success({ result: true, arrDestinations });
                }
                return exits.success({ result: false, arrDestinations: [] });
            });            
        } else {
            return exits.success({ result: false, arrDestinations: [] });
        }
    },
};
