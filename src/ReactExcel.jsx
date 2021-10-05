import React, { useState, useEffect } from 'react';
import { ExcelRenderer } from 'react-excel-renderer'

const ExcelDateToJSDate = (serial) => {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);


    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
}


const ReactExcel = () => {
    
    const [dataset, setData] = useState([])
    const [importStatus, setImportStatus] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)

    const importToDatabase = async(data) => {
        if(data.length === 0){
            setErrorMessage("Please upload excel(xlsx) file first")
        }else {
            try{
                setErrorMessage(false)
                setImportStatus(false)
                let response = await fetch('http://localhost:6001/import', {
                    headers: {
                        "Content-type": "application/json"
                    },
                    method: "POST",
                    body: JSON.stringify(data)
                })
                let responseData = await response.json()
                if(responseData === "Import Success!"){
                    setImportStatus(true)
                }
            }
            catch(err){
                setErrorMessage(err)
            }
        }
    }

    const fileHandler = (e) => {
        let fileObj =  e.target.files[0];
        if(fileObj.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"){
            setErrorMessage("Please upload valid excel file")
        }
        else {
            setErrorMessage(false)
            let importData = []
            ExcelRenderer(fileObj, (err, resp) => {
                if(err){
                    console.log(err)
                }else {
                    importData = resp.rows.map((row, i) => { 
                        if(i !== 0 && row[1] !== undefined){
                            // For the date time, need to use column 5 at row[5]
                            let sendObject = {
                                "fleet": row[1],
                                "vehicle_plate": row[2],
                                "datetime": ExcelDateToJSDate(row[5]),
                                "event_type": row[3],
                                "latitude": row[6],
                                "longitude": row[7],
                                "machine_validation": row[8],
                                "human_validation": row[9],
                                "hyperlink": row[11],
                            }
                            // console.log(i + "  : " + ExcelDateToJSDate(row[5]))
                            return sendObject
                            // Then pass the data object to state first
                        }
                    })
                    let cleanData = importData.filter((row,i) => {
                        if(i !== 0 || typeof(row) !== undefined) return row
                    })
                    setData(cleanData) 
                }
            })
        }
        
    }

    return (
        <div>
            <input type="file" placeholder="Upload Excel File here" onChange={fileHandler} />
            <button onClick={() => importToDatabase(dataset)}>Upload xlsx file</button>
            <p style={{"color": "#A3EBB1"}}>{importStatus ? "Import Success!" : null}</p>
            <p style={{"color": "red"}}>{errorMessage ? errorMessage : null}</p>
        </div>
        
    )

}

export default ReactExcel;