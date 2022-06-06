require('dotenv').config();

const config = {
  pagerDuty: {
    hostname: process.env.PAGERDUTY_HOSTNAME,
    apiVersion: process.env.PAGERDUTY_API_VERSION,
    token: process.env.PAGERDUTY_TOKEN,
    scheduleId: process.env.PAGERDUTY_SCHEDULE_ID,
  }
}

module.exports = config
