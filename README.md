# company-logic

API Endpoints

  POST /package/create-send-package
    parameters:
      body: {
        date_send: 'AAAA-MM-DD',
        city: 'City name' ( example: La Plata, Buenos Aires, Argentina...Rosario, Argentina)
      }

      Transfer and create package to the warehouse and set 'In warehouse' state. The warehouse cant = cant++;

  PUT /package/send-package
    parameters:
      body: {
        id: package_id
      }

      Modify package with status 'In destination'. Modify instance warehouse with cant--.

  ------------------------------------------------------------------------------

  If state a Warehouse or Package require, use:

  GET /package/:id

  GET /warehouse/:id
