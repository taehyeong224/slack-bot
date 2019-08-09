import * as axios from "axios";
const baseURL = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst`;
const PM10 = {
  GOOD: 30,
  NORMAL: 80,
  BAD: 150,
  VERY_BAD: 999
};
const PM25 = {
  GOOD: 15,
  NORMAL: 35,
  BAD: 75,
  VERY_BAD: 999
};
export const TYPE = {
  PM10: "PM10",
  PM25: "PM25"
};
const DUST_STATUS = {
  GOOD: "좋음",
  NORMAL: "보통",
  BAD: "나쁨",
  VERY_BAD: "매우 나쁨"
};
export const getStatus = async type => {
  const data = await requestDust(type);
  console.log(data);
  const seoulData = data.list[0].seoul;
  let status = "";

  switch (type) {
    case TYPE.PM10:
      if (seoulData < PM10.GOOD) {
        status = DUST_STATUS.GOOD;
      } else if (seoulData < PM10.NORMAL) {
        status = DUST_STATUS.NORMAL;
      } else if (seoulData < PM10.BAD) {
        status = DUST_STATUS.BAD;
      } else {
        status = DUST_STATUS.VERY_BAD;
      }

      break;

    case TYPE.PM25:
      if (seoulData < PM25.GOOD) {
        status = DUST_STATUS.GOOD;
      } else if (seoulData < PM25.NORMAL) {
        status = DUST_STATUS.NORMAL;
      } else if (seoulData < PM25.BAD) {
        status = DUST_STATUS.BAD;
      } else {
        status = DUST_STATUS.VERY_BAD;
      }

      break;
  }

  return {
    status: status,
    data: seoulData
  };
};

const requestDust = async type => {
  try {
    const key = process.env.DUST_API_KEY;
    const url = `${baseURL}?serviceKey=${key}&numOfRows=1&pageNo=1&itemCode=${type}&dataGubun=HOUR&searchCondition=WEEK&_returnType=json`;
    console.log(`url : ${url}`);
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error("axios error", e);
  }
};

const sample = {
  list: [{
    "_returnType": "json",
    "busan": "18",
    "chungbuk": "14",
    "chungnam": "12",
    "daegu": "13",
    "daejeon": "6",
    "dataGubun": "1",
    "dataTerm": "",
    "dataTime": "2019-08-09 13:00",
    "gangwon": "15",
    "gwangju": "12",
    "gyeongbuk": "13",
    "gyeonggi": "13",
    "gyeongnam": "17",
    "incheon": "18",
    "itemCode": "10008",
    "jeju": "11",
    "jeonbuk": "6",
    "jeonnam": "12",
    "numOfRows": "10",
    "pageNo": "1",
    "resultCode": "",
    "resultMsg": "",
    "searchCondition": "",
    "sejong": "11",
    "seoul": "17",
    "serviceKey": "",
    "totalCount": "",
    "ulsan": "29"
  }],
  parm: {
    "_returnType": "json",
    "busan": "",
    "chungbuk": "",
    "chungnam": "",
    "daegu": "",
    "daejeon": "",
    "dataGubun": "HOUR",
    "dataTerm": "",
    "dataTime": "",
    "gangwon": "",
    "gwangju": "",
    "gyeongbuk": "",
    "gyeonggi": "",
    "gyeongnam": "",
    "incheon": "",
    "itemCode": "10008",
    "jeju": "",
    "jeonbuk": "",
    "jeonnam": "",
    "numOfRows": "1",
    "pageNo": "1",
    "resultCode": "",
    "resultMsg": "",
    "searchCondition": "WEEK",
    "sejong": "",
    "seoul": "",
    "serviceKey": "XtvRvBVCs1VmlZD8KfgO5zLmYV73SGNrvw5HucyJL4ppQPfmCd7cYpnJ7zbQpQioZVrnUySbpC82lsfr8s5gng==",
    "totalCount": "",
    "ulsan": ""
  },
  "CtprvnMesureLIstVo": {
    "_returnType": "json",
    "busan": "",
    "chungbuk": "",
    "chungnam": "",
    "daegu": "",
    "daejeon": "",
    "dataGubun": "HOUR",
    "dataTerm": "",
    "dataTime": "",
    "gangwon": "",
    "gwangju": "",
    "gyeongbuk": "",
    "gyeonggi": "",
    "gyeongnam": "",
    "incheon": "",
    "itemCode": "10008",
    "jeju": "",
    "jeonbuk": "",
    "jeonnam": "",
    "numOfRows": "1",
    "pageNo": "1",
    "resultCode": "",
    "resultMsg": "",
    "searchCondition": "WEEK",
    "sejong": "",
    "seoul": "",
    "serviceKey": "XtvRvBVCs1VmlZD8KfgO5zLmYV73SGNrvw5HucyJL4ppQPfmCd7cYpnJ7zbQpQioZVrnUySbpC82lsfr8s5gng==",
    "totalCount": "",
    "ulsan": ""
  },
  "totalCount": 25
};