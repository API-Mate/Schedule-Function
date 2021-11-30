'use strict'

const axios = require("axios");

module.exports = async (event, context) => {
  const result = {
    'body': JSON.stringify(event.body),
    'content-type': event.headers["content-type"]
  }
  console.log(new Date())
  const now = new Date();
  now.setSeconds(0, 0);
  const oneMinLater = new Date((new Date()).getTime() + 1000 * 60);
  oneMinLater.setSeconds(0, 0);

  await axios.post('http://gateway.openfaas:8080/function/data-function',
    {
      table: "Requests",
      record: { scheduled: { $ne: 0 }, "requests.data.schedule": { $ne: "now" } },
      query: "find"
    }).then(function (response) {
      if (response.data.length > 0) {
        response.data.forEach(req => {
          console.log('req')
          console.log(req)
          const schTime = new Date(req.requests.data.schedule);

          console.log(schTime)
          console.log(now)
          console.log(oneMinLater)

          let request = req.requests;
          request.data.schedule = "now";
          request.scheduleid = req._id;
          request.userid = req.user_id;
          if (now <= schTime && schTime < oneMinLater) {
            console.log('inside if')
            console.log(request)
            axios.post('http://gateway.openfaas:8080/function/main-function', request).then(function (response) {
              console.log(response.data)
            }).catch(function (error) {
              console.log(error)
            });
          } else {
            console.log('not now')
          }
        });
      }
    });
  return context
    .status(200)
    .succeed(result)
}