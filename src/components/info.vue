<template>
  <div class="right">
    <InfoList title="每日新闻" :list="newsList"></InfoList>
    <InfoList class="mt-40" title="科普常识" :list="knowledgeList"></InfoList>
    <InfoList class="mt-40" title="公告" :list="noticeList"></InfoList>
  </div>
</template>

<script>
import { getDayNews, getTopKnowledge, getTopNotice } from "@/apis/apis";
import InfoList from "./infoList.vue";
export default {
  created() {
    getDayNews().then((res) => {
      this.newsList = res.data.data;
    });
    getTopKnowledge().then((res) => {
      this.knowledgeList = res.data.data;
    });
    getTopNotice().then((res) => {
      this.noticeList = res.data.data;
    });
  },
  components: { InfoList },
  data() {
    return {
      newsList: [],
      knowledgeList: [],
      noticeList: [],
    };
  },
};
</script>

<style lang="scss" scoped>
.right {
  width: 200px;
  flex-shrink: 0;
  position: sticky;
  top: 10px;
  align-self: flex-start;
}
</style>
