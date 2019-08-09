import express from "express";
import * as bodyParser from 'body-parser';
import { WebClient } from "@slack/web-api";
require('dotenv').config();

const channels = {
    test: "CM7QQ4VAT",
    general: "CKC5WGP8B"
}
const token = process.env.TOKEN;
const general = channels.test;
const web = new WebClient(token);

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

app.get("/", (req, res) => {
    res.status(200).json({msg: "success"});
})

app.listen(app.get('port'), () => {
    console.log('running on port', app.get('port'));
})
// express setting end
