export class AbstractMaker {
    text;
    _keyword;
    _payLoad;

    constructor(text = "") {
        this._text = text;
    }

    build() {
        this.preProcessing();
        this.mainProcessing();
        return this.getMessage();
    }

    preProcessing() {
    }

    mainProcessing() {
    }

    request() {
    }

    getMessage() {
    }


    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }


    get keyword() {
        return this._keyword;
    }

    set keyword(value) {
        this._keyword = value;
    }


    get payLoad() {
        return this._payLoad;
    }

    set payLoad(value) {
        this._payLoad = value;
    }

    makePayLoad({channel, message}) {
    }
}