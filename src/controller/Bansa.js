import {AbstractMaker} from "./AbstractMaker";

export class Bansa extends AbstractMaker {
    constructor(text = "") {
        super(text);
        this.keyword = ['바보', '멍청이'];
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

    makePayLoad({channel, message}) {
        return {channel, text: message, icon_emoji: ":raised_hand_with_fingers_splayed:"};
    }
}