import '@babel/polyfill'

import { RTMClient } from "@slack/rtm-api";
import { WebClient } from "@slack/web-api";
import * as schedule from "node-schedule";
import { getStatus, TYPE } from "./dust";

import express from "express";
import * as bodyParser from 'body-parser';



require('dotenv').config();
const channels = {
    test: "CM7QQ4VAT",
    general: "CKC5WGP8B"
}

// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.TOKEN;
const general = channels.test;
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

rtm.on('message', (message) => {
    try {
        console.log(message);
        const { channel, user, text } = message;
        const filter = bansaList.filter(s => s === text);
        if (checkHasKeyword(bansaList, text)) {
            web.chat.postMessage({ channel, text: '반사', icon_emoji: ":raised_hand_with_fingers_splayed:" });
        }
        if (checkHasKeyword(dustList, text)) {
            dust();
        }
    } catch (e) {
        console.error("message error : ", error);
    }

});


// After the connection is open, your app will start receiving other events.
rtm.on('user_typing', (event) => {
    console.log(event);
})

rtm.on("disconnected", (error) => {
    console.error("disconnected : ", error)
})

rtm.on("channel_created", (event) => {
    web.chat.postMessage({ channel: general, text: `#${event.channel.name} 채널이 생성되었습니다.`, icon_emoji: ":raised_hand_with_fingers_splayed:" });
})

schedule.scheduleJob('0 0 13 * * ?', () => {
    web.chat.postMessage({ channel: general, text: `점심 맛있게 드셨나요?`, icon_emoji: ":raised_hand_with_fingers_splayed:" });
});

schedule.scheduleJob('30 * * * *', () => {
    dust();
});

const dust = async () => {
    const pm10 = await getStatus(TYPE.PM10)
    const pm25 = await getStatus(TYPE.PM25)
    web.chat.postMessage({ channel: general, text: `
현재 서울 미세먼지
pm10: ${pm10.data} ${pm10.status}
pm2.5: ${pm25.data} ${pm25.status}`, icon_emoji: ":mask:" });
}

const checkHasKeyword = (list, target) => {
    const filter = list.filter(s => s === target);
    return filter.length > 0;
}

// express setting start
const app = express();
app.set("port", process.env.PORT || 3000)

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/webhook', (req, res) => {
    console.log(req.body);
    const {app, user, url, head, head_long, git_log, release} = req.body;
    web.chat.postMessage({ channel: general, text: `${user}님이 ${app} 배포 완료, ${git_log}`, icon_emoji: ":hugging_face:" });
    res.status(200).json({msg: "success"});
})

app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'));
})
// express setting end