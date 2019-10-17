import {AbstractMaker} from "./AbstractMaker";
import * as axios from "axios";
import {DUST_STATUS, PM10, PM25, TYPE} from "../config";

export class Dust extends AbstractMaker {
    baseURL = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst`;
    pm10;
    pm25;

    constructor(text = "") {
        super(text);
    }

    async build() {
        this.preProcessing();
        await this.mainProcessing();
        return this.getMessage(this.pm10, this.pm25);
    }

    preProcessing() {
    }

    async mainProcessing() {
        this.pm10 = await this.getStatus(TYPE.PM10);
        this.pm25 = await this.getStatus(TYPE.PM25);
    }

    async getStatus(type) {
        const data = await this.request(type);
        if (!data) {
            return false;
        }
        const seoulData = data.list[0].seoul;
        let status = "";

        switch (type) {
            case TYPE.PM10:
                if (seoulData < PM10.GOOD) {
                    status = DUST_STATUS.GOOD;
                } else if (seoulData < PM10.NORMAL) {
                    status = DUST_STATUS.NORMAL;
                } else if (seoulData < PM10.BAD) {
                    status = DUST_STATUS.BAD;
                } else {
                    status = DUST_STATUS.VERY_BAD;
                }

                break;

            case TYPE.PM25:
                if (seoulData < PM25.GOOD) {
                    status = DUST_STATUS.GOOD;
                } else if (seoulData < PM25.NORMAL) {
                    status = DUST_STATUS.NORMAL;
                } else if (seoulData < PM25.BAD) {
                    status = DUST_STATUS.BAD;
                } else {
                    status = DUST_STATUS.VERY_BAD;
                }

                break;
        }

        return {
            status: status,
            data: seoulData
        };
    }

    async request(type) {
        try {
            const key = process.env.DUST_API_KEY;
            const url = `${this.baseURL}?serviceKey=${key}&numOfRows=1&pageNo=1&itemCode=${type}&dataGubun=HOUR&searchCondition=WEEK&_returnType=json`;
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.error("axios error", e);
            return false;
        }
    }

    async getMessage(pm10, pm25) {
        return (!this.pm10 || !this.pm25) ?  `서버에 문제가 생겼나봐요` : `
현재 서울 미세 먼지
pm10: ${pm10.data} ${pm10.status}
pm2.5: ${pm25.data} ${pm25.status}`
    }
}