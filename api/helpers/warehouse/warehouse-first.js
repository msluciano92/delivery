const distance = require('google-distance-matrix');
module.exports = {


  friendlyName: 'Warehouse first',


  description: '',


  inputs: {
      gps_coor: {
        friendlyName: 'Latitud on gps',
        description: '',
        type: 'string',
        defaultsTo: ''
      },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
      const warehouses = await Warehouse.find({});
      const apiKey = 'AIzaSyCx7mYJLJRDPdyynRdX4UGQBY79NTtQXYM';
      distance.key(apiKey);
      const origins = [inputs.gps_coor]; // destination pakage
      const destinations = warehouses.map(warehouse => { //city warehouse
        const elem = warehouse.city;
        return elem;
      });

      let arrDestinationOrder = [];

      return await distance.matrix(origins, destinations, (err, distances) => {
          if (!err) {
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
              return arrDestinationOrder;
          } else {
            console.log(err);
          }
      });


      console.log("sale");
      console.log(otraCosa);



  }
};
