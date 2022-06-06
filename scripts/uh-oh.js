// Description:
//   Un-oh! is a chat bot designed to help speed up resolutions to on-call incidents
//
// Dependencies:
//   "dotenv": "16.0.1"
//   "hubot": "3.3.2"
//
// Configuration:
//   PAGERDUTY_HOSTNAME
//   PAGERDUTY_API_VERSION
//   PAGERDUTY_TOKEN
//   PAGERDUTY_SCHEDULE_ID
//
// Commands:
//   Uh-oh! Who's on-call? - Returns the current on-call engineer configured in PagerDuty.
//
// Author:
//   olivertappin

const http = require('https')
const config = require('../config')

// Upgrade the above using the latest syntax

const pagerDutyRequestOptions = {
  'method': 'GET',
  'hostname': config.pagerDuty.hostname,
  'port': null,
  'path': '/',
  'headers': {
    'Content-Type': 'application/json',
    'Accept': 'application/vnd.pagerduty+json;version=' + config.pagerDuty.apiVersion,
    'Authorization': 'Token token=' + config.pagerDuty.token,
  }
}

const makeRequest = (options, callback) => {
  const request = http.request(options, (response) => {
    const chunks = []
    response.on('data', function (chunk) {
      chunks.push(chunk)
    });
    response.on('end', function () {
      const body = Buffer.concat(chunks)
      const json = JSON.parse(body)
      callback(json)
    });
  });
  request.end()
}

const getPagerDutyOnCallUserId = (callback) => {
  let requestOptions = pagerDutyRequestOptions
  requestOptions.path = '/oncalls?schedule_ids%5B%5D=' + config.pagerDuty.scheduleId
  makeRequest(requestOptions, (json) => {
    callback(json.oncalls[0].user.id)
  })
}

const getPagerDutyUserByUserId = (userId, callback) => {
  let requestOptions = pagerDutyRequestOptions
  requestOptions.path = '/users/' + userId
  makeRequest(requestOptions, (json) => {
    callback(json.user)
  })
}

module.exports = (robot) => {
  robot.hear(/(oncall|on call|on-call)/i, (res) => {
    getPagerDutyOnCallUserId((userId) => {
      getPagerDutyUserByUserId(userId, (user) => {
        response.reply('The current on-call engineer is ' + user.name)
      })
    })
  })
}
