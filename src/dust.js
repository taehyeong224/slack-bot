import * as axios from "axios";
import {DUST_STATUS, PM10, PM25, TYPE} from "./config";

const baseURL = `http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnMesureLIst`;

/**
 * @description 함수 {@link requestDust}의 결과를 가공하는 함수
 * @param {TYPE} type
 * @returns {Promise<{data: Object, status: string}|boolean>}
 */
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

/**
 * 실제로 open api 에 요청하는 함수
 * @param {TYPE} type
 * @returns {Promise<boolean|Object>}
 */
const requestDust = async type => {
  try {
    const key = process.env.DUST_API_KEY;
    const url = `${baseURL}?serviceKey=${key}&numOfRows=1&pageNo=1&itemCode=${type}&dataGubun=HOUR&searchCondition=WEEK&_returnType=json`;
    const response = await axios.get(url);
    return response.data;
  } catch (e) {
    console.error("axios error", e);
    return false;
  }
};


/**
 * 슬랙 메시지 가공하여 보내기
 * @returns {Promise<void>}
 */
export const getDustStatus = async () => {
  const pm10 = await getStatus(TYPE.PM10);
  const pm25 = await getStatus(TYPE.PM25);
  let message = ``;
  if (!pm10 || !pm25) {
    message = `서버에 문제가 생겼나봐요`
  } else {
    message = `
현재 서울 미세 먼지
pm10: ${pm10.data} ${pm10.status}
pm2.5: ${pm25.data} ${pm25.status}`
  }
  return message;
};