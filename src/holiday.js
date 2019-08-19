import * as axios from "axios";
import { SSL_OP_MSIE_SSLV2_RSA_PADDING } from "constants";
//import {convert} from 'xml-js';
const parseString = require('xml-js').parseString;

const baseURL = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`;

const serviceKey = `lBBRnvK6Ek%2BPnbtG3t1M7FJb13qDfUC8CqW2vcRF6s%2B0cBaeeUxpwOziJ7SzBnpmN6ZBQ5TPcisYZ%2BoM8gXy%2BA%3D%3D`;

//test
//http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getHoliDeInfo?solYear=2019&solMonth=08&ServiceKey=lBBRnvK6Ek%2BPnbtG3t1M7FJb13qDfUC8CqW2vcRF6s%2B0cBaeeUxpwOziJ7SzBnpmN6ZBQ5TPcisYZ%2BoM8gXy%2BA%3D%3D

export const getHoliday = async(month) => {
    let solYear = 2019;
    let solMonth = String(month);
    if (solMonth.length < 2) solMonth = `0${solMonth}`;
    try {
        const url = `${baseURL}/getHoliDeInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${serviceKey}`;
        console.log(url);
        
        const response = await axios.get(url);
        console.log("-------------------------");
        console.log(response.data);
        console.log("-------------------------");
        let resultCode = response.data.response.header.resultCode;
        const holiday = response.data.response.body.items.item;
        console.log(url);
        // 성공
        if (resultCode === '00') {
            return {
                resultCode: 200,
                message: printMessage(month, holiday)
            };
        }
        else {
            return {
                resultCode: 500,
            };
        }
        
        
        //console.log(holidayList);
        
        //const result = convert.xml2json(response.data.response.body.items);
        //console.log("--------------------------result--------------------------");
        //console.log(result);
    } catch(e) {
        console.error("axios error", e.response);
        if (e.response.status === 404) {
            return {
                resultCode: 404
            }
        }
    }
}

const printMessage = (month, holidayList) => {
    let message = `${month}월 휴일은`;
    let dateName = "";
    for (let i = 0; i < holidayList.length; i++) {
        if (dateName != holidayList[i].dateName) {
            message += `\n${holidayList[i].dateName} : `;
            dateName = holidayList[i].dateName;
        } else {
            message += ", ";
        }
        message += holidayList[i].locdate;
    }

    message += "\n입니다.";
    console.log(message);
    return message;
}

// Number.prototype.pad = () => {
//     let str = String(this);
//     if (str.length < 2) str = "0" + str;
//     return str;
// }

