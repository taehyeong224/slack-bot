import {AbstractMaker} from "./AbstractMaker";
import * as axios from "axios";
import {FORECAST_TOKEN} from "../config";

export class Weather extends AbstractMaker {
    baseURL = `https://api.openweathermap.org/data/2.5/weather`;
    result;

    constructor(text = "") {
        super(text);
    }

    async build() {
        this.preProcessing();
        await this.mainProcessing();
        return this.getMessage();
    }

    preProcessing() {
        this.text = this.text.split(" ")[1]
    }

    async request() {
        try {
            const url = `${this.baseURL}?q=${encodeURIComponent(this.convertCity(this.text))}&appid=${FORECAST_TOKEN}&units=metric`;
            console.log(`url : ${url}`);
            const response = await axios.get(url);
            return response.data;
        } catch (e) {
            console.error("axios error", e.response);
            if (e.response.status === 404) {
                return {
                    cod: 404
                }
            }
        }
    }

    mainProcessing = async () => {
        const result = await this.request();
        console.log("getCurrentWeather > result : ", result);
        if (result["cod"] === 200) {
            this.result = {
                cod: 200,
                weather: result["weather"][0]["main"],
                temp: result["main"]["temp"],
                humidity: result["main"]["humidity"],
                tempMin: result["main"]["temp_min"],
                tempMax: result["main"]["temp_max"],
            }
        } else if (result["cod"] === 404) {
            this.result = {
                cod: 404
            }
        } else {
            this.result = {
                cod: 500
            }
        }
    };

    getMessage() {
        let message = "";
        if (this.result["cod"] === 200) {
            message = `
날씨: ${this.result["weather"]}
온도: ${this.result["temp"]}
습도: ${this.result["humidity"]}
최저기온: ${this.result["tempMin"]}
최고기온: ${this.result["tempMax"]}
`
        } else if (this.result["cod"] === 404) {
            message = `죄송합니다 해당 도시가 조회 되지 않습니다. ㅠㅠ`
        } else {
            message = `죄송합니다 서버에 문제가 있나봐요`
        }
        return message;
    }

    convertCity = (name) => {
        if (name === "성남") {
            return "seongnam";
        } else if (name === "서울") {
            return "seoul";
        } else if (name === "인천") {
            return "incheon";
        } else if (name === "부산") {
            return "busan"
        } else if (name === "대구") {
            return "daegu";
        } else if (name === "울산") {
            return "ulsan";
        } else if (name === "광주") {
            return "gwangju";
        } else if (name === "여수") {
            return "yeosu";
        } else if (name === "대전") {
            return "daejeon";
        } else if (name === "춘천") {
            return "chuncheon";
        } else if (name === "오산") {
            return "osan";
        } else {
            return name;
        }
    }

}