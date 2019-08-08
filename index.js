const { RTMClient } = require('@slack/rtm-api');
const { WebClient } = require('@slack/web-api');

require('dotenv').config();

const channels = {
    test: "CM7QQ4VAT",
    general: "CKC5WGP8B"
}

// An access token (from your Slack app or custom integration - usually xoxb)
const token = process.env.TOKEN;
const general = channels.general;
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

rtm.on('message', (message) => {
    try {
        console.log(message);
        const { channel, user, text } = message;
        if (text === '바보') {
            web.chat.postMessage({ channel, text: '반사', icon_emoji: ":raised_hand_with_fingers_splayed:" });
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