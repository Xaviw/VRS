<template>
  <div class="container">
    <div class="header">{{ title }}</div>
    <div class="main">
      <ul>
        <li
          v-for="item of data"
          :key="item.id"
          class="item"
          @click="gotoDetail(item.id)"
        >
          <span class="ellipsis-line title">{{ item.title }}</span>
          <span class="date">{{ item.date }}</span>
        </li>
      </ul>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="getData({ type: 'size', data: $event })"
        @current-change="getData({ type: 'page', data: $event })"
        :current-page="page"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllKnowledge, getAllNews, getAllNotice } from "../apis/apis";
import { getTitle } from "../utils/util";

export default {
  created() {
    this.title = getTitle(this.$route.params.type);
    this.getData();
  },
  data() {
    return {
      title: "",
      page: 1,
      pageSize: 20,
      total: 0,
      data: [],
    };
  },
  methods: {
    async getData(e) {
      if (e && e.type == "size") {
        this.pageSize = e.data;
      } else if (e && e.type == "page") {
        this.page = e.data;
      }
      const param = {
        page: this.page,
        pageSize: this.pageSize,
      };
      let res;
      switch (this.$route.params.type) {
        case "news":
          res = await getAllNews(param);
          break;
        case "knowledge":
          res = await getAllKnowledge(param);
          break;
        case "notice":
          res = await getAllNotice(param);
          break;
      }
      if (res) {
        this.data = res.data.data.data;
        if (this.total !== res.data.data.total) {
          this.total = res.data.data.total;
        }
      }
    },
    gotoDetail(id) {
      if (this.$route.params.type == "news") {
        this.$router.push(`/news/${id}`);
      } else if (this.$route.params.type == "knowledge") {
        this.$router.push(`/knowledge/${id}`);
      } else if (this.$route.params.type == "notice") {
        this.$router.push(`/notice/${id}`);
      }
    },
  },
  watch: {
    "$route.params.type": {
      handler: function (newVal) {
        this.title = getTitle(newVal);
        this.page = 1;
        this.pageSize = 20;
        this.total = 0;
        this.getData();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  margin: 0;
  padding: 0;
}
.container {
  display: flex;
  flex-direction: column;
  .header {
    letter-spacing: 1px;
    font-weight: 700;
    color: #333;
    font-size: 16px;
    padding: 40px 0 20px 0;
  }
  .main {
    flex-grow: 1;
    overflow: auto;
    padding: 0 10px 10px 10px;
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      margin-top: 20px;
      font-size: 14px;
      letter-spacing: 1px;
      color: #666;
      &:hover {
        color: #4490f1;
        .date {
          color: #4490f1;
        }
      }
      .title {
        margin-right: 20px;
      }
      .date {
        width: 100px;
        color: #999;
        flex-shrink: 0;
      }
    }
  }
  .footer {
    text-align: center;
    border-top: 1px solid #ebeef5;
  }
}
</style>
