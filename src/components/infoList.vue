<template>
  <div class="list-item">
    <div class="header">
      <slot></slot>
      <span class="title">{{ title }}</span>
      <span class="all" @click="gotoAll()"
        >全部<i class="el-icon-arrow-right"
      /></span>
    </div>
    <div class="list">
      <span
        class="item ellipsis-line"
        v-for="item of list"
        :key="item.id"
        @click="gotoDetail(item.id)"
        >{{ item.title }}</span
      >
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "list"],
  methods: {
    gotoAll() {
      if (this.title == "每日新闻") {
        this.$router.push("/news");
      } else if (this.title == "科普常识") {
        this.$router.push("/knowledge");
      } else if (this.title == "公告") {
        this.$router.push("/notice");
      }
    },
    gotoDetail(id) {
      if (this.title == "每日新闻") {
        this.$router.push(`/news/${id}`);
      } else if (this.title == "科普常识") {
        this.$router.push(`/knowledge/${id}`);
      } else if (this.title == "公告") {
        this.$router.push(`/notice/${id}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.list-item {
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .title {
      letter-spacing: 1px;
      font-weight: 700;
      color: #333;
      font-size: 16px;
    }
    .all {
      color: #999;
      cursor: pointer;
      i {
        margin-left: 3px;
      }
    }
  }
  .list {
    margin-top: 17px;
    .item {
      display: block;
      padding-left: 15px;
      margin-top: 14px;
      width: 100%;
      color: #333;
      position: relative;
      cursor: pointer;
      &:hover {
        color: #4490f1;
      }
      &::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background-color: #4490f1;
        position: absolute;
        left: 3px;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
</style>
