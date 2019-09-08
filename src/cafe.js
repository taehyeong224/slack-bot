const request = require('request');
const async = require('async');
const cheerio = require('cheerio');

const baseURL = 'http://section.blog.naver.com/sub/SearchBlog.nhn?type=post&option.keyword=%EC%96%B4%EC%9D%80%EB%8F%99%20%EB%A7%9B%EC%A7%91&term=&option.startDate=&option.endDate=&option.page.currentPage={{page}}&option.orderBy=sim';

const search = function (page, result, end) {
    const url = baseURL.replace('{{page}}', page);

    async.waterfall([
        function (callback) {
            request.get({
                url: url
            }, function (err, res, thml){
                if(err)
                return callback(err);
                var $ = cheerio.load(html);
                callback(null, $);
            });
        },
        function ($, callback) {
            $('.search_list li h5 a').each(function () {
                result.push({title: $(this).text().trim(), href: $(this).attr('href')});
            });
            callback(null);
        }
    ], function() {
        if(page >= 5) {
            function shuffle(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                while (0 !== currentIndex) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                return array;
            }

            result = shuffle(result);

            var random_pick = [];
            var idx = 0;
            while(random.pick.length < 1) {
                if(result[idx].title.length > 0) {
                    random_pick.push(result[idx]);
                }
                idx++;
            }
            end(random_pick);
        }else{
            search(page +1, result, end);
        }
    });
};


