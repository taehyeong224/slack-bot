import * as axios from "axios";
import {FORECAST_TOKEN} from "./config";

const baseURL = `https://api.openweathermap.org/data/2.5/weather`;

const requestCurrentWeather = async (city) => {
    try {
        const url = `${baseURL}?q=${city}&appid=${FORECAST_TOKEN}&units=metric`;
        console.log(`url : ${url}`);
        const response = await axios.get(url);
        return response.data;
    } catch (e) {
        console.error("axios error", e);
    }
};

// 404

/**
 * {
    "cod": "404",
    "message": "city not found"
    }
 */


export const getCurrentWeather = async (city) => {
    const result = await requestCurrentWeather(city);
    if (result["cod"] === 200) {
        return {
            cod: 200,
            weather: result["weather"]["main"],
            temp: result["weather"]["main"]["temp"],
            humidity: result["weather"]["main"]["humidity"],
            tempMin: result["weather"]["main"]["temp_min"],
            tempMax: result["weather"]["main"]["temp_max"],
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