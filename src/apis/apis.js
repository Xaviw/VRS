import axios from "./index";

// FIXME
function login(data) {
  const url = "http://localhost:3000/passport/login";
  return axios.post(url, data);
}

function register(data) {
  const url = "/passport/regist";
  return axios.post(url, data);
}

function logout() {
  const url = "/passport/logout";
  return axios.post(url);
}

function checkName(name) {
  const url = `/passport/usernameIsExist?username=${name}`;
  return axios.get(url);
}

function searchHospital(data) {
  const url = "/hospital/searchHospital";
  // FIXME
  if (/\d+/.test(data.keyword)) {
    return Promise.resolve({
      data: {
        status: 0,
        msg: "OK",
        data: {
          total: 1,
          type: 1,
          data: [
            {
              hospitalId: "530000199207128074",
              hospitalName: "第八人民医院",
              date: "1984-11-12 13:16:16",
              vaccineId: "230000200603270296",
              vaccineName: "疫苗名称",
              vaccineBrief:
                "疫苗介绍疫苗介绍疫苗介绍疫苗介绍疫苗介绍疫苗介绍疫苗介绍",
              ban: "禁止人群禁止人群禁止人群",
              notes:
                "注意事项注意事项注意事项注意事项注意事项注意事项注意事项注意事项注意事项",
              vaccineSpecId: "2300002123453270296",
              spec: "第一针 / 共三针",
              price: 120,
              teamNum: "138666",
              isJoin: 2,
            },
          ],
        },
      },
    });
  }
  return axios._get(url, data);
}

function getDayNews() {
  const url = "/news/getDayNews";
  return axios.get(url);
}

function getAllNews(data) {
  const url = "/news/getAllNews";
  return axios._get(url, data);
}

function getTopKnowledge() {
  const url = "/news/getTopKnowledge";
  return axios.get(url);
}

function getAllKnowledge(data) {
  const url = "/news/getAllKnowledge";
  return axios._get(url, data);
}

function getTopNotice() {
  const url = "/news/getTopNotice";
  return axios.get(url);
}

function getAllNotice(data) {
  const url = "/news/getAllNotice";
  return axios._get(url, data);
}

function getArticle(id) {
  const url = "/news/getNewsById";
  return axios._get(url, { id });
}

export {
  login,
  register,
  logout,
  checkName,
  getDayNews,
  getAllNews,
  getTopKnowledge,
  getAllKnowledge,
  getTopNotice,
  getAllNotice,
  searchHospital,
  getArticle,
};
