import '@babel/polyfill'
import {Slackbot} from "./Slackbot";

if (process.env.NODE_ENV !== "test") {
    const bot = new Slackbot();
    bot.setup();
}
