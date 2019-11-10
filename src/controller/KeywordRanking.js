import {AbstractMaker} from "./AbstractMaker";
import * as axios from "axios";
import * as cheerio from "cheerio";

export class KeywordRanking extends AbstractMaker {
    result;
    html;

    constructor(text = "") {
        super(text);
        this.keyword = ['실검'];
    }

    async build() {
        this.preProcessing();
        await this.mainProcessing();
        return this.getMessage();
    }

    preProcessing() {
    }

    async mainProcessing() {
        this.html = await this.request();
        const ranking = [];
        const $ = cheerio.load(this.html.data);
        const $allAgeData = $('div.keyword_rank').children().eq(0).find('ul').children('li');

        $allAgeData.each(function (i, elem) {
            ranking[i] = $(this).find('span').text();
        });

        console.log(ranking);
        this.result = ranking;
    }

    async request() {
        const url = "https://datalab.naver.com/keyword/realtimeList.naver?where=main";
        try {
            return await axios.get(url);
        } catch (e) {
            console.error("axios error", e.response);
        }
    }

    getMessage() {
        let message = "";
        for (let i = 0; i < 10; i++) {
            message += `[${i + 1}] ${this.result[i]}\n`;
        }
        return message;
    }

    makePayLoad({channel, message}) {
        return {channel, username: "급상승 검색어", text: message, icon_url: "http://www.econovill.com/news/photo/201411/224765_9935_410.png"};
    }
}