const excel = require('./excel')
const cors = require('cors')

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

app.get('/getFatigue', async (req, res) => {

    let validCount = 0
    let invalidCount = 0
    knex('eventrecord')
    .count('human_validation')
    .where({'human_validation': "Valid", 'event_type': 'Driver Fatigue'})
    .then(data => validCount = data[0]["count"])
    .catch(console.log)

    knex('eventrecord')
    .count('human_validation')
    .where({'human_validation': "Invalid", 'event_type': 'Driver Fatigue'})
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