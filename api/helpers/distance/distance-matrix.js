var distance = require('google-distance-matrix');

module.exports = {


    friendlyName: 'Distance matrix',


  description: 'returns the distance between two or more locations',

  inputs: {
    origin: {
      type: 'string',
      description: '',
    }
  },

  fn: async function (inputs, exits) {
    const origins = [inputs.origin];
    const warehouses = await Warehouse.find({});
    const destinations = warehouses.map(warehouse => { //city warehouse
      const elem = warehouse.city;
      return elem;
    });
    const apiKey = 'AIzaSyCx7mYJLJRDPdyynRdX4UGQBY79NTtQXYM';
    distance.key(apiKey);
    distance.mode('driving');

    await distance.matrix(origins, destinations, (err, distances) => {
      if (err) {
        console.log(err);
      }

      if (distances === undefined) {
        console.log("ERROR: %s", destinations)
        return exits.success(-1)
      }

      if (distances.rows[0].elements[0].distance === undefined) {
        console.log("ERROR: %s", destinations)
        return exits.success(-1)
      }

      let arrDestinationOrder = [];
      let ind = 0;
      distances.rows[0].elements.forEach(elem => {
            if (elem.status === 'OK') {
                arrDestinationOrder.push(
                  { city: destinations[ind],
                    distance: elem.distance,
                  }
                );
            }
            ind += 1;
      });
      arrDestinationOrder.sort((a, b) => {
        return parseFloat(a.distance.value) > parseFloat(b.distance.value);
      });
      return exits.success(arrDestinationOrder);
    });
  }

};
