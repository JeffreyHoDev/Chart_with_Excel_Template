import './App.css';
import React, { useState, useEffect } from 'react';

import {PieChart} from './chart/pie'

function App() {

  const [displayData, setDisplayData ] = useState([])
  const [fatigueHumanData, setFatigueHumanData ] = useState([])
  const [fatigueMachineData, setFatigueMachineData ] = useState([])

  const getFatigue = async(e, eventtype) => {
    e.preventDefault()
    try{
      
      let response = await fetch('http://localhost:6001/getFatigue', {
        headers: {
          "Content-type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({"type": e.target.value})
      })
      let data = await response.json()
      data["type"] = "fatigue"

      switch(e.target.value){
        case "human":
          await setFatigueHumanData(data)
          break;
        case "machine":
          await setFatigueMachineData(data)
          break;
        default:
          break;
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetch('http://localhost:6001/getExcel')
    .then(response => response.json())
    .then(data => {
      data["type"] = "overall"
      setDisplayData(data)
    })
  }, [fatigueHumanData, fatigueMachineData])


  return (
    <div className="App">
      <header className="App-header">
      <div className="chart-flex">
        <div className="overall-chart">
          <div className="overall-human">
            <h3>Overall Human Validation</h3>
            <PieChart data={displayData}/>
          </div>
          <div className="overall-machine">
            <h3>Overall Machine Validation</h3>
            <PieChart data={displayData}/>
          </div>
        </div>
        <div className="fatigue-chart">
          <div className="fatigue-human">
            <button onClick={(e) => getFatigue(e,"fatigue")} value="human">Get Fatigue Human Validation</button>
            <h3>Fatigue Human Validation</h3>
            <PieChart data={fatigueHumanData}/>
          </div>
          <div className="fatigue-machine">
            <button onClick={(e) => getFatigue(e, "fatigue")} value="machine" >Get Fatigue Machine Validation</button>
            <h3>Fatigue Machine Validation</h3>
            <PieChart data={fatigueMachineData}/>
          </div>
        </div>
        {/* <div className="fatigue-chart">
          <div className="fatigue-human">
            <button onClick={getFatigue} value="human">Get Forward Collision Warning Human Validation</button>
            <h3>Fatigue Human Validation</h3>
            <PieChart data={fatigueHumanData}/>
          </div>
          <div className="fatigue-machine">
            <button onClick={getFatigue} value="machine" >Get Forward Collision Warning Machine Validation</button>
            <h3>Fatigue Machine Validation</h3>
            <PieChart data={fatigueMachineData}/>
          </div>
        </div> */}
      </div>
      </header>
    </div>
  );
}

export default App;
