import * as axios from "axios";
import {HOLIDAY_API_KEY} from "./config";
//import {convert} from 'xml-js';
//const parseString = require('xml-js').parseString;

const baseURL = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`;

export const getHoliday = async(month) => {
    let solYear = 2019;
    let solMonth = String(month);
    if (solMonth.length < 2) solMonth = `0${solMonth}`;
    try {
        const url = `${baseURL}/getHoliDeInfo?solYear=${solYear}&solMonth=${solMonth}&ServiceKey=${HOLIDAY_API_KEY}`;
        console.log(url);
        
        const response = await axios.get(url);
        let resultCode = response.data.response.header.resultCode;
        const holiday = response.data.response.body.items.item;

        console.log("resultCode : " + resultCode);
        console.log(holiday);

        // 성공
        if (resultCode === '00') {
            let msg = printMessage(month, holiday)
            return {
                resultCode: 200,
                message: msg
            };
        }
        else {
            return {
                resultCode: 500,
            };
        }
        
        //console.log(holidayList);
        
        //const result = convert.xml2json(response.data.response.body.items);
        //console.log(result);
    } catch(e) {
        console.error("axios error", e.response);
        //if (e.response.status === 404) {
            return {
                resultCode: 404
            }
        //}
    }
}

const printMessage = (month, holiday) => {
    let message = `${month}월 휴일은`;
    let dateName = "";

    if (Array.isArray(holiday)) {
        for (let i = 0; i < holiday.length; i++) {
            if (dateName != holiday[i].dateName) {
                message += `\n${holiday[i].dateName} : `;
                dateName = holiday[i].dateName;
            } else {
                message += ", ";
            }
            message += `${getDateString(holiday[i].locdate)}`
        }
    } else {
        message += `\n${holiday.dateName} : ${getDateString(holiday.locdate)}`;
    }
    
    message += "\n입니다.";
    console.log(message);
    return message;
}

const getDateString = (holidayLocdate) => {
    const dateObj = getDate(holidayLocdate);
    let index = dateObj.getDay();

    const days = ["일", "월", "화", "수", "목", "금", "토"];
    let day = days[index];

    let str = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${day})`;
    return str;
}

const getDate = (holidayLocdate) => {
    let year = String(holidayLocdate).substring(0, 4);
    let month = String(holidayLocdate).substring(4, 6);
    let date = String(holidayLocdate).substring(6, 8);
    
    return new Date(`${year}-${month}-${date}`);
}

// Number.prototype.pad = function() 으로 하면 작동함
// Number.prototype.pad = () => {
//     let str = String(this);
//     if (str.length < 2) str = "0" + str;
//     return str;
// }

