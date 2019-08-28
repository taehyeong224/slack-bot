import * as axios from "axios";
import moment from "moment";


import {FOOTBALL_KEY} from "./config";

const mem = {};

export const getMatches = async (league, season, round) => {
    const address = `${league}/${season}/${round}`;
    console.log(`address : ${address}`);
    const cache = mem[address];
    let data;
    if (cache) {
        console.log("캐시 적중");
        data = JSON.parse(cache);
    } else {
        const result = await requestMatch(league, season, round);
        if (result && result.data.statusCode === "200") {
            data = result.data.matches;
            mem[address] = JSON.stringify(data);
        } else {
            data = [];
            return 500;
        }
    }
    return getStringForPrint(data);
};


const requestMatch = async (league, season, round) => {
    try {
        const baseURL = `https://sportsop-soccer-sports-open-data-v1.p.rapidapi.com/v1/leagues/${league}/seasons/${season}/rounds/${round}/matches`;
        const config = {
            method: 'get',
            url: baseURL,
            headers: {
                "x-rapidapi-host": "sportsop-soccer-sports-open-data-v1.p.rapidapi.com",
                "x-rapidapi-key": FOOTBALL_KEY
            },
        };
        const response = await axios.request(config);
        return response.data;
    } catch (e) {
        console.error("axios error", e);
        return false;
    }
};

const getStringForPrint = (data) => {
    console.log("data: ", data)
    let message = "";
    for (let item of data) {
        message += `
팀: ${item.match_slug}
날짜: ${moment(item.date_match).local().format("MM월 DD일 HH:mm")}
---------------------------------------------------------------
`
    }
    return message;
};