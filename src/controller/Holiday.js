import {AbstractMaker} from "./AbstractMaker";
import {HOLIDAY_API_KEY} from "../config";
import * as axios from "axios";
import moment from "moment";

export class Holiday extends AbstractMaker {
    baseURL = `http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService`;
    month;
    result;
    now;
    nowMonth;
    nowYear;
    solYear;
    solMonth;
    holiday;

    constructor(text = "") {
        super(text);
        this.keyword = ['휴일'];
    }

    async build() {
        this.preProcessing();
        await this.mainProcessing();
        return this.getMessage();
    }

    preProcessing() {
        this.month = this.text.split(" ")[0].replace("월", "");
        if (this.month.length < 2) this.month = `0${this.month}`;
        this.now = moment();
        this.nowMonth = this.now.format("MM");
        this.nowYear = this.now.format("YYYY");
        this.solYear = this.nowMonth > this.month ? `${Number(this.nowYear) + 1}` : this.nowYear;
        this.solMonth = String(this.month);
    }

    async mainProcessing() {
        await this.request();
        this.printMessage();
    }

    async request() {
        try {
            const url = `${this.baseURL}/getHoliDeInfo?solYear=${this.solYear}&solMonth=${this.solMonth}&ServiceKey=${HOLIDAY_API_KEY}`;
            console.log(url);
            const response = await axios.get(url);
            let resultCode = response.data.response.header.resultCode;
            this.holiday = response.data.response.body.items.item;

            console.log("resultCode : " + resultCode);
            console.log(this.holiday);

            // 성공
            if (resultCode === '00') {
                let msg = this.printMessage();
                this.result = {
                    resultCode: 200,
                    message: msg
                };
            } else {
                this.result = {
                    resultCode: 500,
                };
            }
        } catch (e) {
            console.error("axios error", e.message);
            this.result = {
                resultCode: 404
            }
        }
    }

    printMessage = () => {
        if (!this.holiday) return "";
        let message = `${this.month}월 휴일은`;
        let dateName = "";

        if (Array.isArray(this.holiday)) {
            for (let i = 0; i < this.holiday.length; i++) {
                if (dateName !== this.holiday[i].dateName) {
                    message += `\n${this.holiday[i].dateName} : `;
                    dateName = this.holiday[i].dateName;
                } else {
                    message += ", ";
                }
                message += `${this.getDateString(this.holiday[i].locdate)}`
            }
        } else {
            message += `\n${this.holiday.dateName} : ${this.getDateString(this.holiday.locdate)}`;
        }

        message += "\n입니다.";
        console.log(message);
        return message;
    };

    getMessage() {
        let message = "";
        console.log(this.result["resultCode"]);
        if (this.result["resultCode"] === 200) {
            message = this.result["message"];
        } else if (result["resultCode"] === 404) {
            message = `죄송합니다 휴일이 조회 되지 않습니다. ㅠㅠ`
        } else {
            message = `죄송합니다 서버에 문제가 있나봐요`
        }
        return message;
    }

    getDateString = (holidayLocdate) => {
        const dateObj = this.getDate(holidayLocdate);
        let index = dateObj.getDay();

        const days = ["일", "월", "화", "수", "목", "금", "토"];
        let day = days[index];

        let str = `${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${day})`;
        return str;
    }

    getDate = (holidayLocdate) => {
        let year = String(holidayLocdate).substring(0, 4);
        let month = String(holidayLocdate).substring(4, 6);
        let date = String(holidayLocdate).substring(6, 8);

        return new Date(`${year}-${month}-${date}`);
    }

    makePayLoad({channel, message}) {
        return {channel, username: '노는 게 제일 좋아', text: message, icon_url: "https://pbs.twimg.com/profile_images/931571066534690816/YjOsFwcJ_400x400.jpg"};
    }
}