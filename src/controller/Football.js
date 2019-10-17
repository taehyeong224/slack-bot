import {AbstractMaker} from "./AbstractMaker";
import {FOOTBALL_KEY} from "../config";
import * as axios from "axios";
import moment from "moment";

const mem = {};

export class Football extends AbstractMaker {
    data;
    league;
    season;
    round;

    constructor(text = "") {
        super(text);
        this.keyword = ['f:', 'F:'];
    }

    async build() {
        this.preProcessing();
        await this.mainProcessing();
        return this.getMessage();
    }

    preProcessing() {
        const params = this.text.toLowerCase().trim().split("f:")[1].trim().split(" ");
        if (params.length !== 3) {
            console.log("ex) f: premier-league 19-20 round-3")
            return null;
        }
        this.league = params[0];
        this.season = params[1];
        this.round = params[2]
    }

    async mainProcessing() {
        const address = `${this.league}/${this.season}/${this.round}`;
        console.log(`address : ${address}`);
        const cache = mem[address];

        if (cache) {
            console.log("캐시 적중");
            this.data = JSON.parse(cache);
        } else {
            const result = await this.request();
            if (result && result.data.statusCode === "200") {
                this.data = result.data.matches;
                mem[address] = JSON.stringify(this.data);
            } else {
                this.data = [];
                return 500;
            }
        }
    }

    async request() {
        try {
            const baseURL = `https://sportsop-soccer-sports-open-data-v1.p.rapidapi.com/v1/leagues/${this.league}/seasons/${this.season}/rounds/${this.round}/matches`;
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
    }

    getMessage() {
        let message = "";
        for (let item of this.data) {
            message += `
팀: ${item.match_slug}
날짜: ${moment(item.date_match).local().format("MM월 DD일 HH:mm")}
---------------------------------------------------------------
`
        }
        return message;
    }

    makePayLoad({channel, message}) {
        return {channel, username: "말이 많은 자", text: message, icon_emoji: ":soccer:"};
    }
}