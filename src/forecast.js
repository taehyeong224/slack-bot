import * as axios from "axios";
import {FORECAST_TOKEN} from "./config";

const baseURL = `https://api.openweathermap.org/data/2.5/weather`;

const requestCurrentWeather = async (city) => {
    try {
        const url = `${baseURL}?q=${encodeURIComponent(convertCity(city))}&appid=${FORECAST_TOKEN}&units=metric`;
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
};

export const getCurrentWeather = async (city) => {
    const result = await requestCurrentWeather(city);
    console.log("getCurrentWeather > result : ", result);
    if (result["cod"] === 200) {
        return {
            cod: 200,
            weather: result["weather"][0]["main"],
            temp: result["main"]["temp"],
            humidity: result["main"]["humidity"],
            tempMin: result["main"]["temp_min"],
            tempMax: result["main"]["temp_max"],
        }
    } else if (result["cod"] === 404) {
        return {
            cod: 404
        }
    } else {
        return {
            cod: 500
        }
    }
};

const convertCity = (name) => {
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
};