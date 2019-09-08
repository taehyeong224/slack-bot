"use strict";

var _src = require("../src");

var _chai = require("chai");

describe('배열', function () {
  const bansaList = ['바보', '멍청이'];
  const dustList = ['미세먼지', '미먼'];
  const forecastLIst = ['현재날씨', '현날'];
  const holidayList = ['휴일'];
  const keywordRankingList = ['실검'];
  describe('#indexOf()', function () {
    it('checkHasKeyword 함수에 bansaList 와 바보를 넣으면 true 를 리턴해야 한다.', function () {
      (0, _chai.expect)((0, _src.checkHasKeyword)(bansaList, "바보")).to.eq(true);
    });
  });
});