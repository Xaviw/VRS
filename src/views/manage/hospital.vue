<template>
  <div class="container">
    <CheckVaccine
      :visible="editVisible"
      @close="editVisible = false"
      @refresh="getInfo"
      :title="vaccineTitle"
      :vaccineData="vaccineData"
      v-if="editVisible"
    ></CheckVaccine>
    <div class="main">
      <div class="flex-between">
        <div>
          <span class="w-auto name">{{ name }}</span>
          <span class="w-auto grade">{{ grade }}</span>
        </div>

        <el-button type="primary" size="medium" @click="handleModify"
          >修改信息</el-button
        >
      </div>

      <p class="mt-20">医院信息：</p>
      <div class="content flex-between">
        <div>
          <span class="title"> 医院简介： </span>
          <el-input
            type="textarea"
            autosize
            v-model="brief"
            size="small"
            style="width: 85%"
          >
          </el-input
          ><br />
          <span class="title"> 医院地址： </span>
          <el-input v-model="address" size="small" style="width: 85%"></el-input
          ><br />
          <span class="title"> 工作时间： </span>
          <el-time-picker
            is-range
            v-model="time"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            size="small"
          >
          </el-time-picker
          ><br />
          <span class="title"> 联系电话1： </span>
          <el-input v-model="mobile" size="small" class="w-auto"></el-input>
          <span class="title phone"> 联系电话2： </span>
          <el-input v-model="mobileBk" size="small" class="w-auto"></el-input>
        </div>
        <img class="logo" :src="logo" />
      </div>
      <div class="mt-20 flex-between">
        <p>疫苗信息</p>
        <el-button type="primary" size="medium" @click="addVaccine"
          >添加疫苗</el-button
        >
      </div>
      <el-table :data="list">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.specInfo"
              size="small"
              :stripe="true"
              style="width: 100%; margin-left: 48px"
            >
              <el-table-column label="规格" prop="spec"></el-table-column>
              <el-table-column label="价格">
                <template slot-scope="scope">
                  <span>{{ scope.row.price | money }}</span>
                </template>
              </el-table-column>
              <el-table-column label="库存" prop="inventory"></el-table-column>
              <el-table-column
                label="预约开始时间"
                prop="date"
              ></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column label="疫苗名称">
          <template slot-scope="scope">
            <span>{{ `${scope.row.vaccineName}` }}</span>
          </template>
        </el-table-column>
        <el-table-column label="介绍" prop="vaccineBrief"></el-table-column>
        <el-table-column prop="ban" label="禁用人群"></el-table-column>
        <el-table-column label="注意事项" prop="notes"></el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="edit(scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Info></Info>
  </div>
</template>

<script>
import { getHospital, modifyHospitalInfo } from "@/apis/apis";
import { money, standardTime } from "util/util";
import Info from "com/info.vue";
import CheckVaccine from "com/checkVaccine.vue";

export default {
  created() {
    this.getInfo();
  },
  data() {
    return {
      list: [],
      logo: null,
      brief: null,
      address: null,
      time: null,
      mobile: null,
      mobileBk: null,
      name: null,
      grade: null,
      editVisible: false,
      vaccineTitle: null,
      vaccineData: null,
    };
  },
  methods: {
    getInfo() {
      getHospital(this.$store.state.userInfo.hospitalId).then((res) => {
        this.logo = res.data.data.logo;
        this.brief = res.data.data.hospitalBrief;
        this.address = res.data.data.address;
        this.mobile = res.data.data.mobile;
        this.mobileBk = res.data.data.mobileBk;
        this.name = res.data.data.hospitalName;
        this.grade = res.data.data.grade;
        let sTime = res.data.data.workTime.split(":");
        let eTime = res.data.data.closeTime.split(":");
        this.time = [
          new Date(2000, 1, 1, sTime[0], sTime[1]),
          new Date(2000, 1, 1, eTime[0], eTime[1]),
        ];
        this.list = res.data.data.vaccine;
      });
    },
    handleModify() {
      const param = {
        id: this.$store.state.userInfo.hospitalId,
        name: this.name,
        grade: this.grade,
        address: this.address,
        mobile: this.mobile,
        mobileBk: this.mobileBk,
        brief: this.brief,
        workTime: standardTime(this.time[0]).split(" ")[1], //上班时间
        closeTime: standardTime(this.time[1]).split(" ")[1], //下班时间
      };
      modifyHospitalInfo(param).then(
        () => {},
        () => {
          this.getInfo();
        }
      );
    },
    edit(data) {
      this.vaccineData = data;
      console.log("this.vaccineData: ", this.vaccineData);
      this.vaccineTitle = "编辑疫苗";
      this.editVisible = true;
    },
    addVaccine() {
      this.vaccineTitle = "添加疫苗";
      this.editVisible = true;
    },
  },
  filters: { money },
  components: { Info, CheckVaccine },
};
</script>

<style scoped lang="scss">
.w-auto {
  width: auto;
}
.container {
  padding: 20px;
  display: flex;
  .main {
    flex-grow: 1;
    padding-right: 40px;
    .name {
      color: #333;
      font-size: 20px;
      font-weight: 700;
      margin-right: 15px;
    }
    .title {
      color: #999;
    }
    .grade {
      color: #999;
      font-size: 14px;
    }
    p {
      font-weight: 600;
    }
    .content {
      > div {
        line-height: 3;
      }
      .logo {
        height: 80px;
        width: 80px;
        border-radius: 5px;
        flex-shrink: 0;
        margin: 20px;
      }
      span {
        font-size: 12px;
        line-height: 2;
      }
      .phone {
        margin-left: 50px;
      }
    }
  }
}
</style>
