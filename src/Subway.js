import * as axios from "axios";
import {DUST_STATUS, PM10, PM25, TYPE} from "./config";
//사용할 Open API주소 입력
const baseURL = `http://swopenAPI.seoul.go.kr/api/subway/744a50566a69666f37315a63676850/xml/fastTransfer/0/5/서울   `;


//여기부터 시작
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
//미세먼지 데이터 요청
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
//지하철 환승정보 요청
const requestSubway
