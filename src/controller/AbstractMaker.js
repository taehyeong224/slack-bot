export class AbstractMaker {
    text;

    constructor(text = "") {
        this.text = text;
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
}