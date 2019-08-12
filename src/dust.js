import * as axios from "axios";
import {DUST_STATUS, PM10, PM25, TYPE} from "./config";
const baseURL = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst`;

export const getStatus = async type => {
  const data = await requestDust(type);
  if (!data) {
    return false;
  }
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
    return false;
  }
};
