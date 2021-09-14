const ExcelJS = require('exceljs')

const workbook = new ExcelJS.Workbook();

const readingExcel = async() => {

    const dataArray = [];
    const file = await workbook.xlsx.readFile('sample.xlsx')
    const worksheet = await file.getWorksheet("(07-13) Sep Open Test")
    worksheet.eachRow({}, (row, rowNumber) => {
        // Get cell value for each row
        if(rowNumber === 1){
            // ignore heading
        }else {
            dataArray.push(row.values)
        }
    })
    return dataArray;
}


module.exports = {
    readingExcel: readingExcel
}
