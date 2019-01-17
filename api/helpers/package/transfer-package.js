module.exports = {


  friendlyName: 'Transfer package',


  description: '',


  inputs: {

    package: {
      type: 'ref',
    },
    city: {
      type: 'string',
    },
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },


  fn: async function (inputs) {
      const date_send = inputs.package.date_send;
      const origin = inputs.package.gps;
      const city = inputs.city;

      const warehouse = await Warehouse.findOne({city});
      if (warehouse !== undefined){
          console.log("llega");
          console.log("city: " + warehouse.city);
          const x = (warehouse.cant * 100);
          console.log("x: " + x);
          const result = (x / warehouse.limit);
          console.log("result: " + result);
          const cumple = (result < 95);
          console.log("cumple: " + cumple);
          if (cumple ){
              const cant = warehouse.cant + 1;
              const updPackage = await Package.updateOne({id: inputs.package.id}).set({state: 'Transfer'});
              if (updPackage !== undefined) {
                  const updWarehouse = await Warehouse.updateOne({id: warehouse.id}).set({cant: cant});
                  if (updWarehouse !== undefined) {
                      return true;
                  } else {
                      return false;
                  }
              } else {
                  return false;
              }
          } else {
              // evalúo ...
              console.log("evaluo que me conviene ...");
              return false;
          }
      }

  }
};
