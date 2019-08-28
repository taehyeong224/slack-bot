import * as axios from "axios";
import * as cheerio from "cheerio";

const getHTML = async() => {
    const url = "https://datalab.naver.com/keyword/realtimeList.naver?where=main";
    try {
        return await axios.get(url);
    } catch (e) {
        console.error("axios error", e.response);
    }
}


export const getKeywordRanking = async() => {
    const html = await getHTML();
    const ranking = [];
    const $ = cheerio.load(html.data);
    const $allAgeData = $('div.keyword_rank').children().eq(0).find('ul').children('li');
    
    $allAgeData.each(function(i, elem) {
        ranking[i] = $(this).find('span').text();
    });

    console.log(ranking);
    return ranking;
}