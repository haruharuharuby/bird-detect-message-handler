'use strict';

const Axios = require('axios')
const moment = require('moment')

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
      Authorization: `Bearer ${authResponse.data.access_token}`,
      'Content-type': 'application/json'
    }
  })
  
  const request = {
    "timestamp": moment().toISOString(),
    "referenceId": "test-event",
    "expiryTime": moment().add(process.env.ALEXA_NOTIFICATION_EXPIRY_MINUTES, 'minutes').toISOString(),
    "event": {
      "name": "AMAZON.WeatherAlert.Activated",
      "payload": {
        "weatherAlert": {
          "alertType": "TORNADO"
        }
      }
    },
    "localizedAttributes": [],
    "relevantAudience": {
      "type": "Multicast",
      "payload": {}
    }
  }
  const eventResponse = await eventClient.post('/v1/proactiveEvents/stages/development', request)
  console.log(eventResponse)
};