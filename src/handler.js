'use strict'

const axios = require("axios");

module.exports = async (event, context) => {
  const result = {
    'body': JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }
  console.log(new Date())

  return context
    .status(200)
    .succeed(result)
}