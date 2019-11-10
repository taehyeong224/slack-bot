import {AbstractMaker} from "./AbstractMaker";

export class SearchQuery extends AbstractMaker {
    constructor(text = "") {
        super(text);
        this.keyword = ["검색"]
    }

    build() {
        this.preProcessing();
        this.mainProcessing();
        return this.getMessage();
    }

    preProcessing() {
        this.text = this.text.split("검색")[1] //쿼리 추출 대상 : 검색 문자열 이후 값
            .replace(/(^\s*)|(\s*$)/gi, "") //띄워쓰기가 되어 있지 않을 수 있으므로 앞 뒤 공백 제거
            .split(" ")
            .join("+");
    }

    mainProcessing() {
    }

    request() {
    }

    getMessage() {
        return `https://www.google.co.kr/search?q=${this.text}`;
    }

    makePayLoad({channel, message}) {
        return {channel, text: message, as_user: true};
    }
}