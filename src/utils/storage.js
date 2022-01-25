const local = {
  //存储,可设置过期时间
  set(key, value, expires) {
    if (expires) {
      let params = { value, expires };
      let data = Object.assign(params, { startTime: new Date().getTime() });
      localStorage.setItem(key, JSON.stringify(data));
    } else {
      if (typeof value === "object") {
        value = JSON.stringify(value);
      }
      localStorage.setItem(key, value);
    }
  },
  //取出
  get(key) {
    let item = localStorage.getItem(key);
    if (!item) return;
    let res = JSON.parse(item);
    // 如果有startTime的值，说明设置了失效时间
    if (res && res.startTime) {
      let date = new Date().getTime();
      // 如果大于就是过期了，如果小于或等于就还没过期
      if (date - Number(res.startTime) > res.expires) {
        localStorage.removeItem(key);
        return;
      } else {
        return res.value;
      }
    } else {
      return res;
    }
  },
  // 删除
  remove(key) {
    localStorage.removeItem(key);
  },
  // 清除全部
  clear() {
    localStorage.clear();
  },
};

export { local };
