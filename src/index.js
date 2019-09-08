import '@babel/polyfill'

import {RTMClient} from "@slack/rtm-api";
import {WebClient} from "@slack/web-api";
import * as schedule from "node-schedule";
import {getStatus} from "./dust";
import {general, token, TYPE} from "./config";
import {getCurrentWeather} from "./forecast";
import {getHoliday} from "./holiday";
import {getKeywordRanking} from "./realTimeKeywordRanking";

import {convertSearchQuery} from './Search';


// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start().catch(console.error);
// Calling `rtm.on(eventName, eventHandler)` allows you to handle events (see: https://api.slack.com/events)
// When the connection is active, the 'ready' event will be triggered


rtm.on('ready', () => {
    console.log("rtm ready");
});

const bansaList = ['바보', '멍청이'];
const dustList = ['미세먼지', '미먼'];
const forecastLIst = ['현재날씨', '현날'];
const holidayList = ['휴일'];
const keywordRankingList = ['실검'];

rtm.on('message', async (message) => {
    try {
        console.log(message);
        const {subtype, channel, user, text} = message;
        if (checkHasKeyword(bansaList, text)) {
            web.chat.postMessage({channel, text: '반사', icon_emoji: ":raised_hand_with_fingers_splayed:"});
        }
        if (checkHasKeyword(dustList, text)) {
            dust();
        }

        if (checkHasKeyword(forecastLIst, text)) {
            const result = await getCurrentWeather(text.split(" ")[1]);
            console.log("result : ", result);
            let message = "";
            if (result["cod"] === 200) {
                message = `
날씨: ${result["weather"]}
온도: ${result["temp"]}
습도: ${result["humidity"]}
최저기온: ${result["tempMin"]}
최고기온: ${result["tempMax"]}
`
            } else if (result["cod"] === 404) {
                message = `죄송합니다 해당 도시가 조회 되지 않습니다. ㅠㅠ`
            } else {
                message = `죄송합니다 서버에 문제가 있나봐요`
            }
            console.log(message)
            web.chat.postMessage({channel, text: message, icon_emoji: ":fox_face:"});
        }


        // -------------------- 공휴일 --------------------
        if (checkHasKeyword(holidayList, text)) {
            console.log(subtype);
            if (subtype === 'bot_message') {
                return;
            }

            //const result = await getHoliday(text.split)
            let month = text.split(" ")[0].replace("월", "");
            const result = await getHoliday(month);
            console.log("result: " + result);

            let message = "";
            console.log(result["resultCode"]);
            if (result["resultCode"] === 200) {
                message = result["message"];
            } else if (result["resultCode"] === 404) {
                message = `죄송합니다 휴일이 조회 되지 않습니다. ㅠㅠ`
            } else {
                message = `죄송합니다 서버에 문제가 있나봐요`
            }

            console.log(message);
            web.chat.postMessage({
                channel,
                username: '노는 게 제일 좋아',
                text: message,
                icon_url: "https://pbs.twimg.com/profile_images/931571066534690816/YjOsFwcJ_400x400.jpg"
            });
        }

        // -------------------- 실검 --------------------
        if (checkHasKeyword(keywordRankingList, text)) {
            const result = await getKeywordRanking();
            //console.log(result);

            let message = "";
            for (let i = 0; i < 10; i++) {
                message += `[${i + 1}] ${result[i]}\n`;
            }
            console.log(message);
            web.chat.postMessage({
                channel,
                username: "급상승 검색어",
                text: message,
                icon_url: "http://www.econovill.com/news/photo/201411/224765_9935_410.png"
            });
        }

        // 검색
        if (!message.text.includes("검색")) {
            return;
        }
        let queryURI = convertSearchQuery(message.text);
        if (queryURI) {
            web.chat.postMessage({
                channel: message.channel,
                text: queryURI,
                as_user: true
            });
        }

    } catch (e) {
        console.error("message error : ", error);
    }
});


// After the connection is open, your app will start receiving other events.
rtm.on('user_typing', (event) => {
    console.log(event);
});

rtm.on("disconnected", (error) => {
    console.error("disconnected : ", error)
});

rtm.on("channel_created", (event) => {
    web.chat.postMessage({
        channel: general,
        text: `#${event.channel.name} 채널이 생성되었습니다.`,
        icon_emoji: ":raised_hand_with_fingers_splayed:"
    });
});

schedule.scheduleJob('0 0 13 * * ?', () => {
    web.chat.postMessage({channel: general, text: `점심 맛있게 드셨나요?`, icon_emoji: ":raised_hand_with_fingers_splayed:"});
});

schedule.scheduleJob('30 * * * *', () => {
    dust();
});

const dust = async () => {
    const pm10 = await getStatus(TYPE.PM10)
    const pm25 = await getStatus(TYPE.PM25)
    let message = ``;
    if (!pm10 || !pm25) {
        message = `서버에 문제가 생겼나봐요`
    } else {
        message = `
현재 서울 미세 먼지
pm10: ${pm10.data} ${pm10.status}
pm2.5: ${pm25.data} ${pm25.status}`
    }
    web.chat.postMessage({
        channel: general, text: message, icon_emoji: ":mask:"
    });
};

const checkHasKeyword = (list, target) => {
    const filter = list.filter(s => target.includes(s));
    return filter.length > 0;
};


//------------------카페 식당 검색기-------------------
//cafe.js
// rtm.on(RTM_EVENTS.MESSAGE, function (message) {
//     var channel = message.channel;
//     var user = message.user;
//     var text = message.text;
//
//     var detecting = ['커피', '배고파', '뭐먹을까', '뭐먹지','저녁','점심', '야근'];
//     var matches = stringSimilarity.findBestMatch(text, detecting).bestMatch;
//     web.chat.postMessage(channel, resp, {username: "baseballbot"});
// });