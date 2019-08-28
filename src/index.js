import '@babel/polyfill'

import {RTMClient} from "@slack/rtm-api";
import {WebClient} from "@slack/web-api";
import * as schedule from "node-schedule";
import {getStatus} from "./dust";
import {general, token, TYPE} from "./config";
import {getCurrentWeather} from "./forecast";
import { convertSearchQuery } from './Search';
import { ConsoleLogger } from '@slack/logger';


// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const web = new WebClient(token);

rtm.start().catch(console.error);
// Calling `rtm.on(eventName, eventHandler)` allows you to handle events (see: https://api.slack.com/events)
// When the connection is active, the 'ready' event will be triggered

rtm.on('ready', () => {
    console.log("rtm ready");
    // web.chat.postMessage({ channel: general, text: '봇 준비 완료', icon_emoji: ":hugging_face:" });
})

const bansaList = ['바보', '멍청이'];
const dustList = ['미세먼지', '미먼'];
const forecastLIst = ['현재날씨', '현날'];

rtm.on('message', async (message) => {
    try {
        console.log(message);
        const {channel, user, text} = message;
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


//Search.js
require('dotenv').config();

const convertSearchQuery = require("./query").convertSearchQuery;
const token = process.env.SLACK_TOKEN;
// web, rtm은 중복되므로 쓰지 않음

if(!token){
    console.log('You must specify a token to use this example');
    process.exitCode = 1;
    return;
}

//메시지 입력 이벤트 핸들러
rtm.on("message", (message) => {
    if(!message.text.includes("검색!")){
        return;
    }
    let queryURI = convertSearchQuery(message.text);
    if(queryURI){
        web.chat.postMessage({
            channel : message.channel,
            text : queryURI,
            as_user : true
        });
    }
});