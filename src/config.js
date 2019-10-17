import {Dust} from "./controller/Dust";
import {Football} from "./controller/Football";
import {Holiday} from "./controller/Holiday";
import {KeywordRanking} from "./controller/KeywordRanking";
import {SearchQuery} from "./controller/SearchQuery";
import {Bansa} from "./controller/Bansa";
import {Weather} from "./controller/Weather";

require('dotenv').config();

export const channels = {
    test: "CM7QQ4VAT",
    general: "CKC5WGP8B"
}

export const token = process.env.TOKEN;
export const FORECAST_TOKEN = process.env.FORECAST_TOKEN;
export const FOOTBALL_KEY = process.env.FOOTBALL_KEY;
export const HOLIDAY_API_KEY = process.env.HOLIDAY_API_KEY;

export const general = channels.test;

export const PM10 = {
    GOOD: 30,
    NORMAL: 80,
    BAD: 150,
    VERY_BAD: 999
};

export const PM25 = {
    GOOD: 15,
    NORMAL: 35,
    BAD: 75,
    VERY_BAD: 999
};

/**
 * @type {{PM25: string, PM10: string}}
 */
export const TYPE = {
    PM10: "PM10",
    PM25: "PM25"
};

export const DUST_STATUS = {
    GOOD: "좋음",
    NORMAL: "보통",
    BAD: "나쁨",
    VERY_BAD: "매우 나쁨"
};

export const NAME_OF_ARRAY = {
    bansaList: "bansaList",
    dustList: "dustList",
    forecastLIst: "forecastLIst",
    holidayList: "holidayList",
    keywordRankingList: "keywordRankingList",
    football: "football",
    search: "search"
};

export const MATCHING = {};
MATCHING[NAME_OF_ARRAY.bansaList] = Bansa;
MATCHING[NAME_OF_ARRAY.dustList] = Dust;
MATCHING[NAME_OF_ARRAY.forecastLIst] = Weather;
MATCHING[NAME_OF_ARRAY.holidayList] = Holiday;
MATCHING[NAME_OF_ARRAY.keywordRankingList] = KeywordRanking;
MATCHING[NAME_OF_ARRAY.football] = Football;
MATCHING[NAME_OF_ARRAY.search] = SearchQuery;

export const KEYWORD = {};
KEYWORD[NAME_OF_ARRAY.bansaList] = ['바보', '멍청이'];
KEYWORD[NAME_OF_ARRAY.dustList] = ['미세먼지', '미먼'];
KEYWORD[NAME_OF_ARRAY.forecastLIst] = ['현재날씨', '현날'];
KEYWORD[NAME_OF_ARRAY.holidayList] = ['휴일'];
KEYWORD[NAME_OF_ARRAY.keywordRankingList] = ['실검'];
KEYWORD[NAME_OF_ARRAY.football] = ['f:', 'F:'];
KEYWORD[NAME_OF_ARRAY.search] = ["검색"];

export const GET_SLACK_PAYLOAD = (nameOfArray, {channel, message}) => {
    let payload = {};
    switch (nameOfArray) {
        case NAME_OF_ARRAY.bansaList:
            payload = {channel, text: message, icon_emoji: ":raised_hand_with_fingers_splayed:"};
            break;
        case NAME_OF_ARRAY.dustList:
            payload = {channel, text: message, icon_emoji: ":mask:"};
            break;
        case NAME_OF_ARRAY.forecastLIst:
            payload = {channel, text: message, icon_emoji: ":fox_face:"};
            break;
        case NAME_OF_ARRAY.holidayList:
            payload = {channel, username: '노는 게 제일 좋아', text: message, icon_url: "https://pbs.twimg.com/profile_images/931571066534690816/YjOsFwcJ_400x400.jpg"};
            break;
        case NAME_OF_ARRAY.keywordRankingList:
            payload = {channel, username: "급상승 검색어", text: message, icon_url: "http://www.econovill.com/news/photo/201411/224765_9935_410.png"};
            break;
        case NAME_OF_ARRAY.football:
            payload = {channel, username: "말이 많은 자", text: message, icon_emoji: ":soccer:"};
            break;
        case NAME_OF_ARRAY.search:
            payload = {channel, text: message, as_user: true};
            break;
        default:

            break;
    }
    return payload;
};
