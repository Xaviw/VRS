<template>
  <div class="container">
    <div class="header flex-between">
      <span>{{ title }}</span
      ><el-button
        type="primary"
        size="medium"
        v-if="$store.state.isBack"
        @click="$router.push('/manage/publish/' + $route.params.type)"
        >发布{{ title }}</el-button
      >
    </div>
    <div class="main">
      <ul>
        <li v-for="item of data" :key="item.id" class="item flex-between">
          <a class="ellipsis-line title" @click="gotoDetail(item.id)">{{
            item.title
          }}</a>
          <span class="date">
            {{ item.date }}
            <el-button
              type="primary"
              size="small"
              style="margin-left: 20px"
              v-if="$store.state.isBack"
              @click="
                $router.push('/manage/' + $route.params.type + '/' + item.id)
              "
              >编辑</el-button
            >
            <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDelete(item.id)"
              style="margin-left: 20px"
              v-if="$store.state.isBack"
            >
              <el-button type="danger" slot="reference" size="small"
                >删除</el-button
              >
            </el-popconfirm>
          </span>
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
import { getAllKnowledge, getAllNews, getAllNotice } from "@/apis/apis";
import { getTitle } from "util/util";
import { deleteArticle } from "../apis/apis";

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
    handleDelete(id) {
      deleteArticle(id).then(() => {
        this.getData();
      });
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
        cursor: pointer;
      }
      .date {
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
