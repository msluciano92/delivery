# company-logic

API CALL'S

  POST /package/create-send-package
    parameters:
      body: {
        date_send: 'AAAA-MM-DD',
        gps: 'City name' (La Plata, Buenos Aires, Argentina...Rosario, Argentina)
      }

      Transfer and create package to the warehouse and set 'In warehouse' state. The warehouse cant = cant++;

  PUT /package/send-package
    parameters:
      body: {
        id: package_id
      }

    Modify package with status 'In destination'. Modify instance warehouse with cant--.
