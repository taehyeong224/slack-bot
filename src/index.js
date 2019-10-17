import '@babel/polyfill'

import {RTMClient} from "@slack/rtm-api";
import {WebClient} from "@slack/web-api";
import * as schedule from "node-schedule";
import {getDustStatus, getStatus} from "./dust";
import {general, token, TYPE} from "./config";
import {getCurrentWeather} from "./forecast";
import {getHoliday} from "./holiday";
import {getKeywordRanking} from "./realTimeKeywordRanking";
import {convertSearchQuery} from './Search';
import {getMatches} from "./football";


// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);
const web = new WebClient(token);

if (process.env.NODE_ENV !== "test") {
    rtm.start().catch(console.error);

    rtm.on('ready', () => {
        console.log("rtm ready");
    });

    const bansaList = ['바보', '멍청이'];
    const dustList = ['미세먼지', '미먼'];
    const forecastLIst = ['현재날씨', '현날'];
    const holidayList = ['휴일'];
    const keywordRankingList = ['실검'];
    const football = ['f:', 'F:'];

    rtm.on('message', async (message) => {
        try {
            const {subtype, channel, user, text} = message;
            if (checkHasKeyword(bansaList, text)) {
                web.chat.postMessage({channel, text: '반사', icon_emoji: ":raised_hand_with_fingers_splayed:"});
                return {channel, text: '반사', icon_emoji: ":raised_hand_with_fingers_splayed:"};
            }
            if (checkHasKeyword(dustList, text)) {
                const msg = await getDustStatus();
                web.chat.postMessage({
                    channel: general, text: msg, icon_emoji: ":mask:"
                });
                return;
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
                web.chat.postMessage({channel, text: message, icon_emoji: ":fox_face:"});
                return;
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
                return;
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
                return;
            }

            // 검색
            if (message.text.includes("검색")) {
                const queryURI = convertSearchQuery(message.text);
                if (queryURI) {
                    web.chat.postMessage({
                        channel: message.channel,
                        text: queryURI,
                        as_user: true
                    });
                }
                return;
            }
            // football
            if (checkHasKeyword(football, text)) {
                const params = text.toLowerCase().trim().split("f:")[1].trim().split(" ");
                if (params.length !== 3) {
                    console.log("ex) f: premier-league 19-20 round-3")
                } else {
                    const msg = await getMatches(params[0], params[1], params[2]);
                    web.chat.postMessage({channel: general, text: msg, icon_emoji: ":fox_face:"})
                }
                return;
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

    schedule.scheduleJob('30 * * * *', async () => {
        const msg = await getDustStatus();
        web.chat.postMessage({
            channel: general, text: msg, icon_emoji: ":mask:"
        });
    });
}


/**
 * 해당 키워드 검색
 * @param {Array} list
 * @param {string} target
 * @returns {boolean}
 */
export const checkHasKeyword = (list, target) => {
    const filter = list.filter(s => target.includes(s));
    return filter.length > 0;
};
