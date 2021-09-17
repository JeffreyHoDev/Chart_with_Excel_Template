const excel = require('./excel')
const cors = require('cors')
const bodyParser = require('body-parser')
const express = require('express')

const port = 6001
const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      version: '7.2',
      user : 'postgres',
      password : 'Reunion94!',
      database : 'eventdata'
    }
  });

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/getExcel', async (req, res) => {

    let validCount = 0
    let invalidCount = 0
    knex('eventrecord')
    .count('human_validation')
    .where({'human_validation': "Valid"})
    .then(data => validCount = data[0]["count"])
    .catch(console.log)

    knex('eventrecord')
    .count('human_validation')
    .where({'human_validation': "Invalid"})
    .then(data => invalidCount = data[0]["count"])
    .then(() => {
      let responseData = {
            "valid": parseInt(validCount),
            "invalid": parseInt(invalidCount)
        }
      res.json(responseData)
    })
    .catch(console.log)

})

app.post('/getData', (req, res) => {

    let type = req.body.validation_type;
    let eventType = req.body.event_type
    let validCount = 0
    let invalidCount = 0
    let string = `${type}_validation`

    knex('eventrecord')
    .count(`${type}_validation`)
    .where({[string]: "Valid", 'event_type': eventType})
    .then(data => validCount = data[0]["count"])
    .catch(console.log)

    knex('eventrecord')
    .count(`${type}_validation`)
    .where({[string]: "Invalid", 'event_type': eventType})
    .then(data => invalidCount = data[0]["count"])
    .then(() => {
        let responseData = {
            "valid": parseInt(validCount),
            "invalid": parseInt(invalidCount)
        }
        res.json(responseData)
    })
    .catch(console.log)

})

app.post('/query', (req,res) => {

  let type = req.body.validation_type;
  let eventType = req.body.event_type
  let startDate = req.body.start_date;
  let endDate = req.body.end_date;
  let startDateTime = `${startDate}T00:00:00.000Z`;
  let endDateTime = `${endDate}T23:59:59.000Z`;
  let string = `${type}_validation`

  let validCount = 0
  let invalidCount = 0

  knex('eventrecord')
  .count(`${type}_validation`)
  .where({[string]: "Valid", 'event_type': eventType})
  .whereBetween('datetime', [startDateTime, endDateTime])
  .then(data => validCount = data[0]["count"])
  .catch(console.log)

  knex('eventrecord')
  .count(`${type}_validation`)
  .where({[string]: "Invalid", 'event_type': eventType})
  .whereBetween('datetime', [startDateTime, endDateTime])
  .then(data => invalidCount = data[0]["count"])
  .then(() => {
      let responseData = {
          "valid": parseInt(validCount),
          "invalid": parseInt(invalidCount)
      }
      res.json(responseData)
  })
  .catch(console.log)
})

app.get('/import', async (req, res) => {
    const rawDataFromExcel = await excel.readingExcel()
    const data = rawDataFromExcel.map((item) => {
        // let d = new Date(item[5]);
        // let timestamp = d.getTime()/1000000;
        let object = {};
        object["fleet"] = item[2];
        object["vehicle_plate"] = item[3];
        object["event_type"] = item[4];
        object["datetime"] = item[5];
        object["latitude"] = item[7];
        object["longitude"] = item[8];
        object["machine_validation"] = item[9];
        object["human_validation"] = item[10];
        object["hyperlink"] = item[12];

        knex('eventrecord').insert(object)
        .catch(console.error)
    }) 
    res.send("OK")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})