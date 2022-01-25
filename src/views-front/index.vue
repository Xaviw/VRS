<template>
  <div>
    <img src="../assets/images/banner.jpg" class="container banner" />
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-input
        :placeholder="placeholder"
        v-model.trim="searchKey"
        class="search"
        @blur="placeholder = '点击输入医院名称'"
        @focus="placeholder = ''"
        @keyup.enter.native="handleSearchHospital()"
      >
        <i slot="prefix" class="el-icon-search center"></i>
        <el-link
          slot="suffix"
          type="primary"
          class="text"
          @click="handleSearchHospital()"
          >搜索</el-link
        >
      </el-input>
    </el-row>
    <div class="container main">
      <div class="left">
        <span class="title">{{ hospitalText }}</span>
        <span class="rank" v-show="!type">等级：</span>
        <el-radio-group
          v-show="!type"
          v-model="grade"
          @change="handleSearchHospital($event)"
        >
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="三级医院"></el-radio-button>
          <el-radio-button label="二级医院"></el-radio-button>
          <el-radio-button label="一级医院"></el-radio-button>
        </el-radio-group>
        <div class="list" id="hospitalList" v-show="!type">
          <Card v-for="item of hospitalList" :key="item.id" :item="item"></Card>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <AppointmentCard
          v-for="item of hospitalList"
          :key="item.id || item.hospitalId"
          v-show="type"
          :data="type ? item : []"
          class="mt-40"
        ></AppointmentCard>
        <i id="bottomAnchor"></i>
      </div>
      <div class="right">
        <InfoList title="每日新闻" :list="newsList"></InfoList>
        <InfoList
          class="mt-40"
          title="科普常识"
          :list="knowledgeList"
        ></InfoList>
        <InfoList class="mt-40" title="公告" :list="noticeList"></InfoList>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDayNews,
  getTopKnowledge,
  getTopNotice,
  searchHospital,
} from "../apis/apis";
import Card from "../components/card.vue";
import InfoList from "../components/infoList.vue";
import AppointmentCard from "../components/appointmentCard.vue";
export default {
  components: { Card, InfoList, AppointmentCard },
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
  mounted() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0].intersectionRatio;
        if (ratio > 0 && this.total === null) {
          this.handleSearchHospital();
        } else if (ratio > 0) {
          this.handleLoadHospital();
        }
      },
      { threshold: 0.1 }
    );

    this.observer.observe(document.getElementById("bottomAnchor"));
  },
  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  data() {
    return {
      searchKey: "",
      prevKey: null,
      placeholder: "点击输入医院名称",
      hospitalText: "热门医院",
      hospitalList: [],
      newsList: [],
      knowledgeList: [],
      noticeList: [],
      grade: "全部",
      total: null,
      type: 0,
    };
  },
  methods: {
    handleSearchHospital(grade) {
      if (this.searchKey !== this.prevKey || grade) {
        let param = {
          page: 1,
          pageSize: 20,
        };
        if (this.searchKey) param.keyword = this.searchKey;
        if (this.$store.state.geo) param.area = this.$store.state.geo;
        if (this.gradeValue) param.grade = this.gradeValue;
        searchHospital(param).then((res) => {
          this.type = res.data.data.type;
          this.prevKey = this.searchKey;
          this.hospitalText = res.data.data.type
            ? "组团信息"
            : this.searchKey
            ? "搜索结果"
            : "全部医院";
          this.hospitalList = res.data.data.data;
          this.total = res.data.data.total;
        });
      }
    },
    handleLoadHospital() {
      if (this.hospitalList.length < this.total) {
        const page = this.hospitalList.length / 20 + 1;
        let param = {
          page,
          pageSize: 20,
        };
        if (this.searchKey) param.keyword = this.searchKey;
        if (this.$store.state.geo) param.area = this.$store.state.geo;
        if (this.gradeValue) param.grade = this.gradeValue;
        searchHospital(param).then((res) => {
          this.hospitalList = [...this.hospitalList, ...res.data.data.data];
        });
      }
    },
  },
  computed: {
    gradeValue() {
      let gradeMap = {
        全部: 0,
        一级医院: 1,
        二级医院: 2,
        三级医院: 3,
      };
      return gradeMap[this.grade];
    },
  },
  watch: {
    "$store.state.geo": {
      handler: function (newVal) {
        if (newVal) this.handleSearchHospital();
      },
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-input__inner {
  border: none;
  height: 60px;
  border-bottom: 1px solid #eee;
  border-radius: 0;
  font-size: 16px;
  transition: all 0.3s ease;
  &:focus {
    height: 61px;
    border-bottom: 2px solid #4990f1;
  }
}
#bottomAnchor {
  position: absolute;
  bottom: 0;
  border-top: 300px solid transparent;
}
.banner {
  display: block;
  width: 100%;
}
.rank {
  color: #999;
}
.mt-40 {
  margin-top: 40px;
}
.search {
  max-width: 800px;
  height: 60px;
  input {
    border: none;
    border-bottom: 1px solid #eee;
  }
  i,
  .text {
    font-weight: 700;
    font-size: 16px;
    line-height: 60px;
  }
}
.main {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 20px;
  position: relative;
  .left {
    margin-right: 80px;
    flex-grow: 1;
    .title {
      letter-spacing: 1px;
      font-weight: 700;
      color: #333;
      font-size: 16px;
      margin-bottom: 30px;
      display: block;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }
  }
  .right {
    width: 200px;
    flex-shrink: 0;
    position: sticky;
    top: 10px;
    align-self: flex-start;
  }
}
</style>
