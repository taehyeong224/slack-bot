// const assert = require("assert");
// const convertSearchQuery = require("../query").convertSearchQuery;

// describe("기능 테스트", function(){
//     it("검색을 원하는 케이스 - 한글", function() {
//         assert.strictEqual(convertSearchQuery("검색! 구글링 하는 법"), "https://www.google.co.kr/search?q=구글링+하는+법");
//     });
    
//     it("검색을 원하는 케이스 - 영문", function() {
//         assert.strictEqual(convertSearchQuery("검색! how to search google"), "https://www.google.co.kr/search?q=how+to+search+google");
//     });

//     it("검색을 원하는 케이스 - 띄워쓰기가 안 되어 있는 경우 - 한글", function(){
//         assert.strictEqual(convertSearchQuery("검색!구글링 하는 법"), "https://www.google.co.kr/search?q=구글링+하는+법")

//     });
 
//     it("검색을 원하는 케이스 - 띄워쓰기가 안 되어 있는 경우 - 영문", function(){
//         assert.strictEqual(convertSearchQuery("검색!how to search google"), "https://www.google.co.kr/search?q=how+to+search+google")

//     });

// });

//메시지를 구글 검색 쿼리로 변환하여 반환
export function convertSearchQuery(input){
    let query = extractSearchQuery(input);
    return "https://www.google.co.kr/search?q="+ query;
}

//메시지에서 쿼리 파라미터를 추출
export function extractSearchQuery(input){
    return input.split("검색")[1]//쿼리 추출 대상 : 검색 문자열 이후 값
    .replace(/(^\s*)|(\s*$)/gi,"")//띄워쓰기가 되어 있지 않을 수 있으므로 앞 뒤 공백 제거
    .split(" ")
    .join("+");
}

