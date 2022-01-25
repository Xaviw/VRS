<template>
  <div class="container">
    <div class="header" @click="$router.push(`/${$route.params.type}`)">
      {{ title }}
    </div>
    <div class="main">
      <div id="toolbar-container" class="toolbar"></div>
      <div id="text-container" class="text"></div>
    </div>
  </div>
</template>

<script>
import wangEditor from "wangeditor";
import { getArticle } from "../apis/apis";
import { getTitle } from "../utils/util";
export default {
  created() {
    this.title = getTitle(this.$route.params.type);
  },
  mounted() {
    const editor = new wangEditor("#toolbar-container", "#text-container");
    editor.create();
    editor.disable();
    this.editor = editor;
    this.getDetail();
  },
  data() {
    return {
      editor: null,
    };
  },
  methods: {
    getDetail() {
      getArticle(this.$route.params.id).then((res) => {
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
        this.getDetail();
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
    padding: 40px 0 20px 0;
    cursor: pointer;
    &:hover {
      color: #4490f1;
    }
  }
  .main {
    flex-grow: 1;
    overflow: auto;
    .toolbar {
      display: none;
    }
    .text {
      border: none;
    }
  }
}
</style>
