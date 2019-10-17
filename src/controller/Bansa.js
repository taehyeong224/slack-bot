import {AbstractMaker} from "./AbstractMaker";

export class Bansa extends AbstractMaker {
    constructor(text = "") {
        super(text);
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
        return `반사`;
    }

}