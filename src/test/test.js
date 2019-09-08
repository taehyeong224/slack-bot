import {expect} from "chai"
import {checkHasKeyword} from "../index";


describe('배열', function () {
    const bansaList = ['바보', '멍청이'];
    const dustList = ['미세먼지', '미먼'];
    const forecastLIst = ['현재날씨', '현날'];
    const holidayList = ['휴일'];
    const keywordRankingList = ['실검'];

    describe('checkHasKeyword check', function () {
        it('checkHasKeyword 함수에 bansaList 와 바보를 넣으면 true 를 리턴해야 한다.', function (done) {
            expect(checkHasKeyword(bansaList, "바보")).to.eq(true);
            done()
        });

        it('checkHasKeyword 함수에 bansaList 와 멍청이 넣으면 true 를 리턴해야 한다.', function (done) {
            expect(checkHasKeyword(bansaList, "멍청이")).to.eq(true);
            done()
        });

        it('checkHasKeyword 함수에 bansaList 와 오이를 넣으면 false 를 리턴해야 한다.', function (done) {
            expect(checkHasKeyword(bansaList, "오이")).to.eq(false);
            done()
        });

        it ("checkHasKeyword 함수에 배열에 없는 값을 넣으면 false 를 리턴해야 한다.", function (done) {
            expect(checkHasKeyword(dustList, "바보")).to.eq(false);
            done()
        });

        it ("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #1", function (done) {
            expect(checkHasKeyword(dustList, dustList[0])).to.eq(true);
            done()
        });

        it ("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #2", function (done) {
            expect(checkHasKeyword(dustList, dustList[1])).to.eq(true);
            done()
        });

    });
});