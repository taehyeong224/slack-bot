import {expect, assert} from "chai"
import {checkHasKeyword} from "../index";
import {getStatus} from "../dust";
import {TYPE} from "../config";
import {describe, it} from "mocha";
import {getMatches} from "../football";
import {getHoliday} from "../holiday";


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

        it("checkHasKeyword 함수에 배열에 없는 값을 넣으면 false 를 리턴해야 한다.", function (done) {
            expect(checkHasKeyword(dustList, "바보")).to.eq(false);
            done()
        });

        it("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #1", function (done) {
            expect(checkHasKeyword(dustList, dustList[0])).to.eq(true);
            done()
        });

        it("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #2", function (done) {
            expect(checkHasKeyword(dustList, dustList[1])).to.eq(true);
            done()
        });

        it("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #3", function (done) {
            expect(checkHasKeyword(forecastLIst, forecastLIst[0])).to.eq(true);
            done()
        });

        it("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #4", function (done) {
            expect(checkHasKeyword(forecastLIst, forecastLIst[1])).to.eq(true);
            done()
        });

        it("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #5", function (done) {
            expect(checkHasKeyword(holidayList, holidayList[0])).to.eq(true);
            done()
        });


        it("checkHasKeyword 함수에 배열에 있는 값을 넣으면 true 를 리턴해야 한다. #6", function (done) {
            expect(checkHasKeyword(keywordRankingList, keywordRankingList[0])).to.eq(true);
            done()
        });
    });
});


describe("dust", function () {

    describe("getStatus check", function () {
        this.timeout(50000);
        it("getStatus TYPE.PM10 을 인자로 넣으면 값이 나와야 한다.", function (done) {
            getStatus(TYPE.PM10).then((result) => {
                expect(result).to.not.eq(null);
                expect(result).to.not.eq(undefined);
                expect(result).haveOwnProperty("status");
                expect(result).haveOwnProperty("data");
                done()
            })
        })

        it("getStatus TYPE.PM25 을 인자로 넣으면 값이 나와야 한다.", function (done) {
            getStatus(TYPE.PM25).then((result) => {
                expect(result).to.not.eq(null);
                expect(result).to.not.eq(undefined);
                expect(result).haveOwnProperty("status");
                expect(result).haveOwnProperty("data");
                done()
            })
        })
    })
});

describe("football", function () {
    describe("getMatches", function () {
        this.timeout(50000);
        it("wrong param return number", function (done) {
            getMatches("premierleague", "19-20", "round-9").then((result) => {
                expect(result).to.be.a("string");
                expect(result).to.be.eq("");
                done();
            });
        });

        it("적절한 파라미터 사용 시, 올바른 값 반환", function (done) {
            getMatches("premier-league", "19-20", "round-9").then((result) => {
                expect(result).to.be.a("string");
                expect(result).to.be.length.above(0);
                done();
            });
        })
    })
});

describe("Holiday", function () {
    describe("getHoliday", function () {
        this.timeout(500000);
        it("9월 휴일이라 치면, 9월 휴일이 나온다.", async function () {
            try {
                const result = await getHoliday("9");
                expect(result).haveOwnProperty("resultCode");
                expect(result).haveOwnProperty("message");
                expect(result.resultCode).to.be.eq(200);
            } catch (e) {
                console.error("e : ", e);
                assert.isNotOk(e, e.message)
            }
        })
    })
});
