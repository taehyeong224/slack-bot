import {RTMClient} from "@slack/rtm-api";
import {general, GET_SLACK_PAYLOAD, KEYWORD, MATCHING, token} from "./config";
import {WebClient} from "@slack/web-api";
import * as schedule from "node-schedule";
import {Dust} from "./controller/Dust";

export class Slackbot {
    rtm;
    web;

    constructor() {
        this.rtm = new RTMClient(token);
        this.web = new WebClient(token);
    }

    setup() {
        this.startRTM();
        this.addReadyEvent();
        this.addDustSchedule();
        this.addMessageEvent();
        this.addLunchSchedule();
    }

    addMessageEvent() {
        this.rtm.on('message', async (message) => {
            const {subtype, channel, user, text} = message;
            if (subtype === 'bot_message') {
                return;
            }
            for (let key in MATCHING) {
                if (this.checkHasKeyword(KEYWORD[key], text)) {
                    const controller = new MATCHING[key](text);
                    const message = await controller.build();
                    const payLoad = GET_SLACK_PAYLOAD(key, {message, channel});
                    this.sendToSlack(payLoad);
                    break;
                }
            }
        });
    }

    startRTM() {
        this.rtm.start().catch(console.error);
    }

    addReadyEvent() {
        this.rtm.on('ready', () => {
            console.log("rtm ready");
        });
    }

    addDustSchedule() {
        schedule.scheduleJob('30 * * * *', async () => {
            const dust = new Dust("");
            const msg = dust.build();
            this.sendToSlack({
                channel: general, text: msg, icon_emoji: ":mask:"
            });
        });
    }

    addLunchSchedule() {
        schedule.scheduleJob('0 0 13 * * ?', () => {
            this.sendToSlack({channel: general, text: `점심 맛있게 드셨나요?`, icon_emoji: ":raised_hand_with_fingers_splayed:"});
        });
    }

    checkHasKeyword = (list, target) => {
        if (!Array.isArray(list)) {
            return false;
        }
        const filter = list.filter(s => target.includes(s));
        return filter.length > 0;
    };

    sendToSlack(payload) {
        this.web.chat.postMessage(payload);
    }
}