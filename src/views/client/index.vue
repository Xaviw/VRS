<template>
  <div>
    <img src="@/assets/images/banner.jpg" class="container banner" />
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-input
        :placeholder="placeholder"
        v-model.trim="searchKey"
        class="search"
        @keyup.enter.native="handleSearch()"
      >
        <i slot="prefix" class="el-icon-search center"></i>
        <el-link
          slot="suffix"
          type="primary"
          class="text"
          @click="handleSearch()"
          >搜索</el-link
        >
      </el-input>
    </el-row>
    <div class="container main">
      <div class="left">
        <span class="rank">分类：</span>
        <el-radio-group v-model="mainType" @change="handleSearch($event)">
          <el-radio-button label="医院信息"></el-radio-button>
          <el-radio-button label="疫苗信息"></el-radio-button> </el-radio-group
        ><br />
        <span class="rank" v-if="!type && mainType === '医院信息'">等级：</span>
        <el-radio-group
          v-if="!type && mainType === '医院信息'"
          v-model="grade"
          @change="handleSearch($event)"
        >
          <el-radio-button label="全部"></el-radio-button>
          <el-radio-button label="三级医院"></el-radio-button>
          <el-radio-button label="二级医院"></el-radio-button>
          <el-radio-button label="一级医院"></el-radio-button>
        </el-radio-group>
        <span class="title">{{ hospitalText }}</span>
        <div
          class="list"
          id="hospitalList"
          v-if="mainType == '医院信息'"
          v-show="!type"
        >
          <Card
            v-for="item of hospitalList"
            :key="item.id"
            :item="item"
            :type="mainType"
          ></Card>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <AppointmentCard
          v-for="item of hospitalList"
          :key="item.id || item.hospitalId"
          v-show="type || mainType === '疫苗信息'"
          :data="item || []"
          class="mt-40"
          :teamNum="searchKey"
          :isGroupInfo="mainType === '医院信息' || !!type"
        ></AppointmentCard>
        <i id="bottomAnchor"></i>
      </div>
      <Info></Info>
    </div>
  </div>
</template>

<script>
import { searchHospital, searchVaccine } from "@/apis/apis";
import Card from "com/card.vue";
import AppointmentCard from "com/appointmentCard.vue";
import Info from "com/info.vue";
export default {
  components: { Card, AppointmentCard, Info },
  mounted() {
    this.observer = new IntersectionObserver(
      (entries) => {
        const ratio = entries[0].intersectionRatio;
        if (ratio > 0 && this.total === null) {
          this.handleSearch();
        } else if (ratio > 0) {
          this.handleLazyLoad();
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
      hospitalText: "热门医院",
      hospitalList: [],
      grade: "全部",
      mainType: "医院信息",
      total: null,
      type: 0,
    };
  },
  methods: {
    handleSearch(grade) {
      if (this.searchKey !== this.prevKey || grade) {
        let param = {
          page: 1,
          pageSize: 20,
        };
        if (this.searchKey) param.keyword = this.searchKey;
        if (this.$store.state.geo) param.area = this.$store.state.geo;
        if (this.gradeValue && this.mainType === "医院信息")
          param.grade = this.gradeValue;
        if (this.mainType === "医院信息") {
          searchHospital(param).then((res) => {
            this.type = res.data.data.type;
            this.prevKey = this.searchKey;
            this.hospitalText = res.data.data.type
              ? "组团信息"
              : this.searchKey
              ? "医院搜索结果"
              : "全部医院";
            this.hospitalList = res.data.data.data;
            this.total = res.data.data.total;
          });
        } else {
          searchVaccine(param).then((res) => {
            this.type = res.data.data.type;
            this.prevKey = this.searchKey;
            this.hospitalText = res.data.data.type
              ? "组团信息"
              : this.searchKey
              ? "疫苗搜索结果"
              : "全部疫苗";
            this.hospitalList = res.data.data.data;
            this.total = res.data.data.total;
          });
        }
      }
    },
    handleLazyLoad() {
      if (this.hospitalList.length < this.total) {
        const page = this.hospitalList.length / 20 + 1;
        let param = {
          page,
          pageSize: 20,
        };
        if (this.searchKey) param.keyword = this.searchKey;
        if (this.$store.state.geo) param.area = this.$store.state.geo;
        if (this.gradeValue && this.mainType === "医院信息")
          param.grade = this.gradeValue;
        if (this.mainType === "医院信息") {
          searchHospital(param).then((res) => {
            this.hospitalList = [...this.hospitalList, ...res.data.data.data];
          });
        } else {
          searchVaccine(param).then((res) => {
            this.hospitalList = [...this.hospitalList, ...res.data.data.data];
          });
        }
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
    placeholder() {
      return `点击输入${this.mainType.slice(0, 2)}名称`;
    },
  },
  watch: {
    "$store.state.geo": {
      handler: function (newVal) {
        if (newVal) this.handleSearch(true);
      },
    },
  },
};
</script>

<style scoped lang="scss">
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
  line-height: 4;
}
.search {
  max-width: 800px;
  height: 60px;
  input {
    border: none;
    border-bottom: 1px solid #eee;
  }
  i,
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
      margin-top: 10px;
      display: block;
    }
    .list {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-evenly;
    }
  }
}
</style>
