import React from 'react';
import {Pie} from 'react-chartjs-2';


export const PieChart = ({...props}) => {
    const state = {
        labels: ['Valid', 'Invalid'],
        datasets: [
          {
            backgroundColor: [
              '#B21F00',
              '#C9DE00',
              '#2FDE00',
              '#00A6B4',
              '#6800B4'
            ],
            hoverBackgroundColor: [
            '#501800',
            '#4B5000',
            '#175000',
            '#003350',
            '#35014F'
            ],
            data: [props.data.valid, props.data.invalid]
          }
        ]
    }  
    
    return (
      <div> 
        <Pie
          data={state}
          options={{
            title:{
              display:true,
              text:'Overall Validation',
              fontSize:12
            },
            legend:{
              display:true,
              position:'right'
            }
          }}
        />
      </div>
    );
}