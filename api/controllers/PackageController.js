module.exports = {
    async createPackage (req, res) {
        try {
          const input = req.body;
          const package = await Package.create({date_send: input.date_send, gps: input.gps}).fetch();
          if (package !== undefined){
              //const arrWarehouse = await sails.helpers.warehouse.warehouseFirst.with({gps_coor: package.gps});

              const arrDestinationsOrder = await sails.helpers.distance.distanceMatrix.with({ origin: package.gps });
              if (arrDestinationsOrder !== undefined && arrDestinationsOrder.length > 0 ) {
                  let i = 0;
                  let ok = false;
                  while(i < arrDestinationsOrder.length && !ok) {
                      //console.log("entra while");
                      ok = await sails.helpers.package.transferPackage.with({package: package, city: arrDestinationsOrder[i].city });
                      i += 1;
                  }
              }

          } else {
            res.status(302).json('Error at created package');
          }
        } catch (e) {
          console.log(e),
          res.status(500);
        }
    },
};
