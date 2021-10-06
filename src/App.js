import './App.css';
import React, { useState } from 'react';

import ReactExcel from './ReactExcel';

import {PieChart} from './chart/pie'

function App() {

  const [displayOverallHumanData, setDisplayHumanData ] = useState([])
  const [displayOverallMachineData, setDisplayMachineData ] = useState([])
  const [summaryOverallData, setSummaryOverallData ] = useState("")
  const [summaryFatigueData, setSummaryFatigueData ] = useState("")
  const [summaryForwardData, setSummaryForwardData ] = useState("")
  const [summaryPedestrianData, setSummaryPedestrianData ] = useState("")
  const [fatigueHumanData, setFatigueHumanData ] = useState([])
  const [fatigueMachineData, setFatigueMachineData ] = useState([])
  const [forwardHumanData, setForwardHumanData ] = useState([])
  const [forwardMachineData, setForwardMachineData ] = useState([])
  const [pedestrianHumanData, setPedestrianHumanData ] = useState([])
  const [pedestrianMachineData, setPedestrianMachineData ] = useState([])
  const [startDate, setStartDate ] = useState("")
  const [endDate, setEndDate ] = useState("")

  // Setting Data variable using Hooks - Valid and Invalid Counts
  const settingData = (event_type, validation_type, data) => {
    switch(event_type){
      case "Driver Fatigue":
        if(validation_type === "human"){
          setFatigueHumanData(data)
        }else {
          setFatigueMachineData(data)
        }
        break;
      case "Forward Collision Warning":
        if(validation_type === "human"){
          setForwardHumanData(data)
        }else {
          setForwardMachineData(data)
        }
        break;
      case "Pedestrian Collision Warning":
        if(validation_type === "human"){
          setPedestrianHumanData(data)
        }else {
          setPedestrianMachineData(data)
        }
        break;
      default:
        break;
    }
  }

  // Query data from server to count valid and invalid counts for each event
  const queryData = async(e, startdate, enddate) => {
    e.preventDefault()
    try{
      // Get Overall Human Validation
      let response = await fetch('http://localhost:6001/getExcel',{
        "headers": {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "type": "human",
          "start_date": startdate,
          "end_date": enddate
        })
      })
      
      let data = await response.json()
      data["type"] = "overall"
      setDisplayHumanData(data)

    // Get Overall Machine Validation
    response = await fetch('http://localhost:6001/getExcel',{
      "headers": {
        "Content-type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        "type": "machine",
        "start_date": startdate,
        "end_date": enddate
      })
    })
    
    data = await response.json()
    data["type"] = "overall"
    setDisplayMachineData(data)


      // Handling Driver Fatigue event type
      response = await fetch("http://localhost:6001/query", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Driver Fatigue",
          "validation_type": "human"
        })
      })

      data = await response.json()
      await settingData("Driver Fatigue", "human", data)

      response = await fetch("http://localhost:6001/query", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Driver Fatigue",
          "validation_type": "machine"
        })
      })

      data = await response.json()
      await settingData("Driver Fatigue", "machine", data)

      // Handling Forward Collision Warning event type
      response = await fetch("http://localhost:6001/query", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Forward Collision Warning",
          "validation_type": "human"
        })
      })

      data = await response.json()
      await settingData("Forward Collision Warning", "human", data)

      response = await fetch("http://localhost:6001/query", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Forward Collision Warning",
          "validation_type": "machine"
        })
      })

      data = await response.json()
      settingData("Forward Collision Warning", "machine", data)

      // Handling Pedestrian Collision Warning event type
      response = await fetch("http://localhost:6001/query", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Pedestrian Collision Warning",
          "validation_type": "human"
        })
      })

      data = await response.json()
      await settingData("Pedestrian Collision Warning", "human", data)

      response = await fetch("http://localhost:6001/query", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Pedestrian Collision Warning",
          "validation_type": "machine"
        })
      })

      data = await response.json()
      await settingData("Pedestrian Collision Warning", "machine", data)

      // Get Summary Data
      response = await fetch("http://localhost:6001/getSummaryData", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "overall"
        })
      })

      data = await response.json()
      await setSummaryOverallData(data)

      response = await fetch("http://localhost:6001/getSummaryData", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Driver Fatigue"
        })
      })

      data = await response.json()
      await setSummaryFatigueData(data)

      // Summary of Pedestrian
      response = await fetch("http://localhost:6001/getSummaryData", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Pedestrian Collision Warning"
        })
      })

      data = await response.json()
      await setSummaryPedestrianData(data)

      // Summary of Forward Collision
      response = await fetch("http://localhost:6001/getSummaryData", {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          "start_date": startdate,
          "end_date": enddate,
          "event_type": "Forward Collision Warning"
        })
      })

      data = await response.json()
      await setSummaryForwardData(data)

    }catch(err){
      console.log(err)
    }
  }


  return (
    <div className="App">
      <header className="App-header">
      <div className="input-section">
        <span htmlFor="start_date">Start Date: </span>
        <input type="date" name="start_date" onChange={(e) => setStartDate(e.target.value)}/>
        <span htmlFor="end_date">End Date: </span>
        <input type="date" name="end_date" onChange={(e) => setEndDate(e.target.value)}/>
        <button onClick={(e) => queryData(e, startDate, endDate)}>Search</button>
      </div>
      <ReactExcel />
      <p className="dateRange">{startDate ? startDate : null} - {endDate ? endDate : null}</p>
      <div className="container">
        <div className="chart-flex">
          <div className="overall-chart">
            <div className="overall-human">
              <h3>Overall Human Validation</h3>
              <PieChart data={displayOverallHumanData}/>
            </div>
            <div className="overall-machine">
              <h3>Overall Machine Validation</h3>
              <PieChart data={displayOverallMachineData}/>
            </div>
          </div>
          <div className="fatigue-chart">
            <div className="fatigue-human">
              <h3>Fatigue Human Validation</h3>
              <PieChart data={fatigueHumanData}/>
            </div>
            <div className="fatigue-machine">
              <h3>Fatigue Machine Validation</h3>
              <PieChart data={fatigueMachineData}/>
            </div>
          </div>
          <div className="forward-chart">
            <div className="forward-human">
              <h3>Forward Collision Warning</h3>
              <h3>Human Validation</h3>
              <PieChart data={forwardHumanData}/>
            </div>
            <div className="forward-machine">
              <h3>Forward Collision Warning</h3>
              <h3>Machine Validation</h3>
              <PieChart data={forwardMachineData}/>
            </div>
          </div>
          <div className="pedestrian-chart">
            <div className="pedestrian-human">
              <h3>Pedestrian Collision Warning</h3>
              <h3>Human Validation</h3>
              <PieChart data={pedestrianHumanData}/>
            </div>
            <div className="pedestrian-machine">
              <h3>Pedestrian Collision Warning</h3>
              <h3>Machine Validation</h3>
              <PieChart data={pedestrianMachineData}/>
            </div>
          </div>
        </div>
        <div className="summary-container">
          <h3>Overall</h3>
          <label>Total Events: </label><p>{summaryOverallData ? summaryOverallData: null} </p>
          <label>Total Fatigue Events: </label><p>{summaryFatigueData ? summaryFatigueData: null}</p>
          <label>Total PCW Events: </label><p>{summaryPedestrianData ? summaryPedestrianData: null}</p>
          <label>Total FCW Events: </label><p>{summaryForwardData ? summaryForwardData: null}</p>
        </div>
      </div>
      </header>
    </div>
  );
}

export default App;
