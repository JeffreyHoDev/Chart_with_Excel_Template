import './App.css';
import React, { useState, useEffect } from 'react';

import {PieChart} from './chart/pie'

function App() {

  const [displayData, setDisplayData ] = useState([])
  const [fatigueData, setFatigueData ] = useState([])

  const getFatigue = async(e) => {
    e.preventDefault()
    try{
      
      let response = await fetch('http://localhost:6001/getFatigue')
      let data = await response.json()
      data["type"] = "fatigue"
      await setFatigueData(data)
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
  }, [fatigueData])


  return (
    <div className="App">
      <header className="App-header">
      <h3>Overall Validation</h3>
      <PieChart data={displayData}/>
      <button onClick={getFatigue} >Get Fatigue Validation</button>
      <h3>Fatigue Validation</h3>
      <PieChart data={fatigueData}/>
      </header>
    </div>
  );
}

export default App;
