import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';

import './line.css'

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};



export const LineChart = ({lineData}) => {

  const [dateArray, setDateArray] = useState([])
  const [humanCountsArray, setHumanArray] = useState([])
  const [machineCountsArray, setMachineArray] = useState([])
  const [data, setDataArray] = useState([])
  const [statusSet, SetStatus] = useState(false)

  useEffect(() => {
    if(lineData.length !== 0){
      if(lineData["human_validate"].length !== 0 || lineData["machine_validate"].length !== 0){
        let humanCountsList = lineData["human_validate"].map(item => {
          return item["count"]
        })
        setHumanArray(humanCountsList)
        
        let machineCountsList = lineData["machine_validate"].map(item => {
          return item["count"]
        })
        
        setMachineArray(machineCountsList)

        if(lineData["human_validate"].length === 0) {
          let dateList = lineData["machine_validate"].map(item => {
            return item["date"]
          })
          setDateArray(dateList)
        }else {
          let dateList = lineData["human_validate"].map(item => {
            return item["date"]
          })
          setDateArray(dateList)
        }
        
      }
  
    }
    SetStatus(true)
  }, [lineData])

  useEffect(() => {
    if(statusSet){
      let dataObj = {
        labels: dateArray,
        datasets: [
          {
            label: 'Human Valid Counts',
            data: humanCountsArray,
            fill: false,
            backgroundColor: 'rgb(153,225,122)',
            borderColor: 'rgba(153,41,41)',
          },
          {
            label: 'Machine Valid Counts',
            data: machineCountsArray,
            fill: false,
            backgroundColor: 'rgb(11,83,148)',
            borderColor: 'rgba(225,137,0)',
          },
        ],
      };
      setDataArray(dataObj)
      SetStatus(false)
    }
  }, [statusSet])


  let initialData = {
    labels: ['1', '2', '3', '4', '5', '6'],
    datasets: [
      {
        label: 'Human Valid Counts',
        data: [0,0,0,0,0,0],
        fill: false,
        backgroundColor: 'rgb(153,225,122)',
        borderColor: 'rgba(153,41,41)',
      },
      {
        label: 'Machine Valid Counts',
        data: [0,0,0,0,0,0],
        fill: false,
        backgroundColor: 'rgb(11,83,148)',
        borderColor: 'rgba(225,137,0)',
      },
    ],
  };

  return(
  <>
  {
    lineData.length === 0 ? <Line data={initialData} options={options} />: (
      <>
        <div className='header'>
          <h3 className='title'>Trend of True Valid</h3>
          <span className='date-range'>{`${dateArray[0]} - ${dateArray[dateArray.length-1]}`}</span>
          <Line data={data} options={options} />  
        </div>
      </>
    )
  }
  </>
  )
}

