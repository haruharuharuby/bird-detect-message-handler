'use strict';

const Axios = require('axios')

module.exports.handler = async (event, context) => {
  const querystring = require('querystring')
  const authClient = Axios.create({
    baseURL: process.env.PROACTIVE_AUTH_ENDPOINT,
    headers: {
      'Content-type':'application/x-www-form-urlencoded;charset=UTF-8'
    }
  })
  const authResponse = await authClient.post('/auth/O2/token', 
    querystring.stringify({
      grant_type: 'client_credentials',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: 'alexa::proactive_events'
    })
  )

  if (authResponse.statusCode > 299) {
    throw Error(authResponse.reason)
  }

  const eventClient = Axios.create({
    baseURL: process.env.PROACTIVE_EVENT_ENDPOINT,
    headers: {
      'Content-type':'application/json',
      Authorization: `Bearer: ${authResponse.data.access_token}`
    }
  })

  const eventResponse = await eventClient.post('/v1/proactiveEvents/stages/development', {
    "timestamp": "2019-03-05T11:00:00.00Z",
    "referenceId": "unique-id-of-this-instance",
    "expiryTime": "2019-03-05T12:00:00.00Z",
    "event": {
      "name": "AMAZON.OrderStatus.Updated",
      "payload": {
          "state": {
              "status": "ORDER_SHIPPED",
              "deliveryDetails": {
                  "expectedArrival": "2018-12-14T23:32:00.463Z"
              }
          },
          "order": {
              "seller": {
                  "name": "localizedattribute:sellerName"
              }
          }
      }
    },
     "localizedAttributes": [],
    "relevantAudience": {
      "type": "Multicast"
    }
  })
  console.log(eventResponse)

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
