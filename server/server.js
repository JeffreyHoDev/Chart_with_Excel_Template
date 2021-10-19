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
app.use(bodyParser({limit: '1000mb'})) // Must be above bodyparser.json to avoid error 413 (POST too large payload)
app.use(bodyParser.json())

app.post('/getExcel', async (req, res) => {

    let type = req.body.type
    let validCount = 0
    let invalidCount = 0
    let string = `${type}_validation`
    let startDate = req.body.start_date;
    let endDate = req.body.end_date;
    let startDateTime = `${startDate} 00:00:00+08`;
    let endDateTime = `${endDate} 23:59:59+08`;
    knex('eventrecord')
    .count(`${type}_validation`)
    .where({[string]: "Valid"})
    .whereBetween('datetime', [startDateTime, endDateTime])
    .then(data => validCount = data[0]["count"])
    .catch(console.log)

    knex('eventrecord')
    .count(`${type}_validation`)
    .where({[string]: "Invalid"})
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
  let startDateTime = `${startDate} 00:00:00+08`;
  let endDateTime = `${endDate} 23:59:59+08`;
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

app.post('/import', (req, res) => {
    // const rawDataFromExcel = await excel.readingExcel()
    try {
      req.body.map((item) => {
          // let d = new Date(item[5]);
          // let timestamp = d.getTime()/1000000;
          // let object = {};
          // object["fleet"] = item[2];
          // object["vehicle_plate"] = item[3];
          // object["event_type"] = item[4];
          // object["datetime"] = item[5];
          // object["latitude"] = item[7];
          // object["longitude"] = item[8];
          // object["machine_validation"] = item[9];
          // object["human_validation"] = item[10];
          // object["hyperlink"] = item[12];
  
        knex('eventrecord').insert(item)
        .catch(res.json)
      }) 
      res.json("Import Success!")
    }
    catch(err){
      res.json(err)
    }
})

app.post('/getSummaryData', (req,res) => {

  let eventType = req.body.event_type
  let startDate = req.body.start_date;
  let endDate = req.body.end_date;
  let startDateTime = `${startDate} 00:00:00+08`;
  let endDateTime = `${endDate} 23:59:59+08`;

  if(eventType === "overall"){
    knex('eventrecord')
    .count(`vehicle_plate`)
    .whereBetween('datetime', [startDateTime, endDateTime])
    .then(data => res.json(data[0]["count"]))
    .catch(console.log)
  }else {
    knex('eventrecord')
    .count(`vehicle_plate`)
    .where({'event_type': eventType})
    .whereBetween('datetime', [startDateTime, endDateTime])
    .then(data => res.json(data[0]["count"]))
    .catch(console.log)
  }

})

// Temporary not using
// app.post('/getCompanyCounts', (req,res) => {

//   let startDate = req.body.start_date;
//   let endDate = req.body.end_date;
//   let startDateTime = `${startDate} 00:00:00+08`;
//   let endDateTime = `${endDate} 23:59:59+08`;

//     knex('eventrecord')
//     .distinct('fleet')
//     .groupBy('fleet')
//     .count()
//     .whereBetween('datetime', [startDateTime, endDateTime])
//     .then(data => res.json(data))
//     .catch(console.log)
// })

app.post('/getCompanyCountsDetails', (req,res) => {
  // let eventType = req.body.event_type
  let startDate = req.body.start_date;
  let endDate = req.body.end_date;
  let startDateTime = `${startDate} 00:00:00+08`;
  let endDateTime = `${endDate} 23:59:59+08`;

    knex('eventrecord')
    .distinct(['event_type', 'fleet'])
    .count()
    .groupBy(['fleet', 'event_type'])
    .whereBetween('datetime', [startDateTime, endDateTime])
    .then(data => res.json(data))
    .catch(console.log)
})

app.post('/getCompanyValidateDetails', (req,res) => {
  // let eventType = req.body.event_type
  let startDate = req.body.start_date;
  let endDate = req.body.end_date;
  let startDateTime = `${startDate} 00:00:00+08`;
  let endDateTime = `${endDate} 23:59:59+08`;

    knex('eventrecord')
    .distinct(['fleet','event_type', 'machine_validation'])
    .groupBy(['fleet', 'event_type', 'machine_validation'])
    .count()
    .whereBetween('datetime', [startDateTime, endDateTime])
    .then(data => res.json(data))
    .catch(console.log)
})

// app.post('/getLineData', (req,res) => {
//   let eventType = req.body.event_type;
//   let type = req.body.validation_type;
//   let startDate = req.body.start_date;
//   let endDate = req.body.end_date;
//   let startDateTime = `${startDate} 00:00:00+08`;
//   let endDateTime = `${endDate} 23:59:59+08`;
//   let string = `${type}_validation`

//   knex('eventrecord')
//   .where({'event_type': eventType, [string]: "Valid"})
//   .whereBetween('datetime', [startDateTime, endDateTime])
//   .then(datas => {
//     const dataSet = []
//     datas.map(data => {
//       let date = data["datetime"].toString().substr(4,11)
//       let length = dataSet.length
//       if(length === 0){
//         dataSet.push({
//           "date": date,
//           "count": 1
//         })
//       }else {
//         for(let i=0; i < length; i++){
//           if(dataSet[i]["date"] === date){
//             dataSet[i]["count"] +=1
//             console.log("plus ")
//             break
//           }else if(i === length-1){
//             dataSet.push({
//               "date": date,
//               "count": 1
//             })
//             console.log("push ")
//             break
//           }
//         }
//       }
//       // else{
//       //   dataSet.map((dataFromDataset,i) => {
//       //     if(dataFromDataset["date"] === date){
//       //       dataSet[i]["count"] += 1
//       //       break
//       //     }else if(i === length -1){
//       //       dataSet.push({
//       //         "date": date,
//       //         "count": 1
//       //       })
//       //       break
//       //     }
//       //   })
//       // }

//       res.json(dataSet)
//     })
//   })
//   .catch(console.log)

// })

app.post('/getLine', (req,res) => {

  let type = req.body.validation_type;
  let eventType = req.body.event_type
  let startDate = req.body.start_date;
  let endDate = req.body.end_date;
  let startDateTime = `${startDate} 00:00:00+08`;
  let endDateTime = `${endDate} 23:59:59+08`;
  let string = `${type}_validation`

  knex('eventrecord')
  .where({[string]: "Valid", 'event_type': eventType})
  .whereBetween('datetime', [startDateTime, endDateTime])
  .then(datas => {
    const dataSet = []
      datas.map(data => {
        let date = data["datetime"].toString().substr(4,11)
        let length = dataSet.length
        if(length === 0){
          dataSet.push({
            "date": date,
            "count": 1
          })
        }
        for(let i=0; i < length; i++){
          if(dataSet[i]["date"] === date){
            dataSet[i]["count"] +=1
            break
          }else if(i === length-1){
            dataSet.push({
              "date": date,
              "count": 1
            })
            break
          }
        }
      })
      res.json(dataSet)
  })
  .catch(console.log)

})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})