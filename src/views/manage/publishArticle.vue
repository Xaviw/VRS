<template>
  <div class="container">
    <div class="header flex-between">
      <span @click="$router.push(`/${$route.params.type}`)">{{ title }}</span>
      <el-button type="primary" @click="publish">发布{{ title }}</el-button>
    </div>
    <el-input
      v-model="articleTitle"
      placeholder="请输入标题"
      class="articleTitle"
    ></el-input>
    <div class="main">
      <div id="toolbar-container" class="toolbar"></div>
      <div id="text-container" class="text"></div>
    </div>
  </div>
</template>

<script>
import E from "wangeditor";
import { getTitle } from "util/util";
import { Message } from "element-ui";
import { modifyArticle, getArticle } from "@/apis/apis";
export default {
  created() {
    this.title = getTitle(this.$route.params.type);
  },
  mounted() {
    this.editor = new E("#toolbar-container", "#text-container");
    this.editor.config.uploadImgServer = "/news/addImage";
    this.editor.config.customAlert = (s, t) => {
      switch (t) {
        case "success":
          Message.success(s);
          break;
        case "info":
          Message.info(s);
          break;
        case "warning":
          Message.warning(s);
          break;
        case "error":
          Message.error(s);
          break;
        default:
          Message.info(s);
          break;
      }
    };
    this.editor.create();
    if (this.$route.params.id) {
      this.getDetail();
    }
  },
  data() {
    return {
      editor: null,
      articleTitle: null,
    };
  },
  methods: {
    publish() {
      if (!this.articleTitle) {
        Message.warning("请输入标题");
        return;
      }
      if (!this.editor.txt.text()) {
        Message.warning("请输入内容");
        return;
      }
      const param = {
        title: this.title,
        content: JSON.stringify(this.editor.txt.getJSON()),
      };
      if (this.$route.params.id) {
        param.newsId = this.$route.params.id;
      }
      modifyArticle(param).then((res) => {
        this.$router.push(`/${this.$route.params.type}/${res.data.data}`);
      });
    },
    getDetail() {
      getArticle(this.$route.params.id).then((res) => {
        this.articleTitle = res.data.data.title;
        if (this.editor && res.data.data.content) {
          this.editor.txt.setJSON(res.data.data.content);
        }
      });
    },
  },
  watch: {
    "$route.params.type": {
      handler: function (newVal) {
        this.title = getTitle(newVal);
      },
    },
    "$route.params.id": {
      handler: function () {
        this.title = this.getDetail();
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  .header {
    letter-spacing: 1px;
    font-weight: 700;
    color: #333;
    font-size: 16px;
    padding: 20px 0;
    cursor: pointer;
    &:hover {
      color: #4490f1;
    }
  }
  .articleTitle {
    margin-bottom: 10px;
  }
  .main {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    .toolbar {
      border: 1px solid #ccc;
    }
    .text {
      border: 1px solid #ccc;
      flex-grow: 1;
      overflow: auto;
    }
  }
}
</style>
