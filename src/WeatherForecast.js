const schedule = require('node-schedule');
const {RTMClient, WebClient} = require('@slack/client');
const token = '<#YOUR-SLACK-TOKEN#>';

const rtm = new RTMClient(token);
const web = new WebClient(token);
rtm.start();

const sendMessage = function (text, ch) {
    if(Array.isArray(ch)){
        for(const i = 0; i<ch.length; i++){
            rtm.sendMessage(text, ch[i])
            .then((msg) => console.log('Message sent to channel ${ch}'))
            .catch(console.error);
        }

    }else{
        rtm.sendMessage(text.ch)
        .then((msg)=>console.log('Message sent to channel ${ch}'))
        .catch(console.error);
    }
    
}

const sendForecast = function(location, channel){
    weather.find({search, location, degreeType: 'C'}, function(err, result){
        if(err){
            console.log(err);
            sendMessage('에러!! '+err, channel);
            return;
        }
        if(!result.length){
            sendMessage('정보가 없습니다', channel);
            return;
        }
        
        const now = new Date();
        const tz = now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000);
        now.setTime(tz);

        const weekToday = now.toLocaleString('en-us', {weekday:'short'});
        const weekTommorow = new Date(now.getTime()+24*60*60*1000).toLocaleString('en-us', {weekday:
        'short'});
        const forecastToday = {low:'', high:'', skytextday:''};
        const forecastTomorrow = {low:'', high:'', skytextday:''};
            for(const i = 0; i<result[0].forecast.length; i++){
                if(result[0].forecast[i].shortday == weekToday){
                    forecastToday = result[0].forecast[i];
                }else if (result[0].forecast[i].shortday == weekTommorow){
                    forecastTomorrow = result[0].forecast[i];
                }
            }
            const text = result[0].location.name+'을 기반으로 한 정보입니다.\n\
            현재기온: '+result[0].current.temperature+'\'C, '+result[0].current.skytext+'\n\
            오늘예상: '+forecastToday.skytextday+', 최저' + forecastToday.low+'\'C, 최고'+forecastToday.high+'\'C\n\
            내일예상: '+forecastToday.skytextday+', 최저' + forecastTomorrow.low+'\'C, 최고 '+forecastTomorrow.high+'\'C\n';
                sendMessage(text, channel);
    });
};


rtm.on('message', (message) => {
    if(message.subtype || (!message.subtype && message.user === RTCDTMFSender.activeUserId)) {
        return;
    }
    console.log(message);
    // Log the Message
    console.log('(channel:${message.channel}) ${message.user} says: ${message.text}');
    if(message.text.includes('!날씨')) {
        const location = message.textsplit('!날씨 ')[1];
        if(!location.length){
            return;
        }
        sendWeatherMessage(location, message, channel);
    }
});


const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.hour = 21;
scheduleRule.minute = 0;
const scheduleJob = schedule.scheduleJob(scheduleRule, function(){
    console.log('scheduleJob');
    web.channels.list().then((res)=> {
        //Take my Chnnel for which the bot is a member
        const channels = [];
        for(const i = 0; i< res.channels[i].is_member){
            if(res.channels[i].is_member){
                channels.push(rs.channels[i].id);
            }
                    }
                    if(!channels){
                        console.log('가입된 채널이 없습니다');
                        return;
                    }
                    sendWeatherMessage('Seoul', channels);
    });
});


