require('dotenv').config();

export const channels = {
    test: "CM7QQ4VAT",
    general: "CKC5WGP8B"
}

export const token = process.env.TOKEN;
export const FORECAST_TOKEN = process.env.FORECAST_TOKEN;
export const general = channels.general;
export const HOLIDAY_API_KEY = process.env.HOLIDAY_API_KEY;

export const PM10 = {
    GOOD: 30,
    NORMAL: 80,
    BAD: 150,
    VERY_BAD: 999
};

export const PM25 = {
    GOOD: 15,
    NORMAL: 35,
    BAD: 75,
    VERY_BAD: 999
};

export const TYPE = {
    PM10: "PM10",
    PM25: "PM25"
};

export const DUST_STATUS = {
    GOOD: "좋음",
    NORMAL: "보통",
    BAD: "나쁨",
    VERY_BAD: "매우 나쁨"
};
