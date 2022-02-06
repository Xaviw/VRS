import axios from "./index";

// FIXME
function login(data) {
  const url = "http://localhost:3000/passport/login";
  return axios.post(url, data);
}
// FIXME
function adminLogin(data) {
  const url = "http://localhost:3000/passport/adminLogin";
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
              ban: "禁用人群禁用人群禁用人群",
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

function updateAvatar(data) {
  const url = "/info/editFace";
  return axios.post(url, data);
}

function modifyInfo(data) {
  const url = "/info/editInfo";
  return axios.post(url, data);
}

function getOrders(data) {
  const url = "/order/getAllOrderByUser";
  return axios._get(url, data);
}

function cancelOrder(orderId) {
  const url = "/order/cancelOrder";
  return axios.post(url, { orderId });
}

function getHospital(id) {
  const url = "/hospital/getHospitalById";
  return axios._get(url, { id });
}

function appointment(data) {
  const url = "/order/makeOrder";
  return axios.post(url, data);
}

function modifyHospitalInfo(data) {
  const url = "/hospital/updateHospitalById";
  return axios.post(url, data);
}

function deleteVaccine(id) {
  const url = "/hospital/deleteVaccineById";
  return axios.post(url, { id });
}
function deleteArticle(id) {
  const url = "/hospital/deleteNewsById";
  return axios.post(url, { id });
}
function modifyArticle(data) {
  const url = "/news/editNewsById";
  return axios.post(url, data);
}

export {
  login,
  adminLogin,
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
  modifyInfo,
  updateAvatar,
  getOrders,
  cancelOrder,
  getHospital,
  appointment,
  modifyHospitalInfo,
  deleteVaccine,
  deleteArticle,
  modifyArticle,
};
