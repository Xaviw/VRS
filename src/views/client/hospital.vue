<template>
  <div class="container">
    <AppointmentDialog
      :visible="personListVisible"
      :title="title"
      :hospitalId="data.hospitalId"
      :vaccineSpecId="currentVaccineId"
      @close="personListVisible = false"
      @refresh="handleGetInfo"
      :money="currentMoney"
    ></AppointmentDialog>
    <span class="name">{{ data.hospitalName }}</span>
    <span class="grade">{{ data.grade }}</span>
    <div class="main">
      <img class="logo" :src="data.logo" />
      <div class="content">
        <p class="title-block">医院信息：</p>
        <span class="title"> 医院简介： </span>
        <span class="info block"> {{ data.hospitalBrief }} </span><br />
        <span class="title"> 医院地址： </span>
        <span class="address block"> {{ data.address }} </span><br />
        <span class="title"> 工作时间： </span>
        <span class="time block"> {{ data.workTime + ' - ' + data.closeTime }} </span><br />
        <span class="title"> 联系电话1： </span>
        <span class="phone block">
          {{ data.mobile }}
        </span>
        <span class="title"> 联系电话2： </span>
        <span class="phone2 block">
          {{ data.mobileBk }}
        </span>
        <p class="title-block">疫苗信息</p>
        <el-table :data="list">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.specInfo" size="small" :stripe="true" style="width: 100%; margin-left: 48px">
                <el-table-column label="规格" prop="spec"></el-table-column>
                <el-table-column label="价格">
                  <template slot-scope="scope">
                    <span>{{ scope.row.price | money }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="库存" prop="inventory"></el-table-column>
                <el-table-column label="预约开始时间" prop="date"></el-table-column>
                <el-table-column label="操作" width="320">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleOrder('个人预约', scope.row.vaccineSpecId, scope.row.price)"
                      >个人预约</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleOrder('家庭预约', scope.row.vaccineSpecId, scope.row.price)"
                      >家庭预约</el-button
                    >
                    <el-button
                      size="mini"
                      type="primary"
                      @click="handleOrder('组团预约', scope.row.vaccineSpecId, scope.row.price)"
                      v-if="props.row.isGroup"
                      >组团预约</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="序号" width="50" type="index"></el-table-column>
          <el-table-column label="疫苗名称" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ `${scope.row.vaccineName}（共${scope.row.specInfo.length}针）` }}</span>
            </template>
          </el-table-column>
          <el-table-column label="介绍" prop="vaccineBrief" show-overflow-tooltip></el-table-column>
          <el-table-column prop="ban" label="禁用人群" show-overflow-tooltip></el-table-column>
          <el-table-column label="注意事项" prop="notes" show-overflow-tooltip></el-table-column>
          <el-table-column label="类别" show-overflow-tooltip width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.type ? '儿童' : '成人' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生产厂家" prop="factory" show-overflow-tooltip></el-table-column>
          <el-table-column label="生产日期" prop="productDate" width="150" show-overflow-tooltip></el-table-column>
        </el-table>
        <p class="title-block">组团信息</p>
        <AppointmentCard
          v-for="item of groupInfo"
          :key="item.id || item.hospitalId"
          :data="item"
          class="mb-40"
          :teamNum="item.teamNum"
          :isGroupInfo="true"
        ></AppointmentCard>
      </div>
    </div>
  </div>
</template>

<script>
  import { getHospital } from '@/apis/apis';
  import { money } from 'util/util';
  import AppointmentDialog from 'com/appointmentDialog.vue';
  import AppointmentCard from 'com/appointmentCard.vue';
  import { Message } from 'element-ui';

  export default {
    created() {
      this.handleGetInfo();
    },
    data() {
      return {
        data: {},
        list: [],
        groupInfo: [],
        personListVisible: false,
        title: '',
        currentVaccineId: null,
        currentMoney: null,
      };
    },
    methods: {
      handleGetInfo() {
        getHospital(this.$route.params.id).then(res => {
          this.data = res.data.data;
          this.list = res.data.data.vaccine;
          this.groupInfo = res.data.data.groupInfo;
        });
      },
      handleOrder(type, id, money) {
        if (this.$store.state.isLogin) {
          this.currentVaccineId = id;
          this.title = type;
          this.personListVisible = true;
          this.currentMoney = money;
        } else {
          Message.info('请先点击右上角登录！');
        }
      },
    },
    filters: { money },
    components: { AppointmentDialog, AppointmentCard },
  };
</script>

<style scoped lang="scss">
  .container {
    padding: 20px;
    .name {
      color: #333;
      font-size: 20px;
      font-weight: 700;
      margin-right: 15px;
    }
    .title {
      color: #999;
    }
    .block {
      display: inline-block;
      margin-bottom: 8px;
    }
    .grade {
      color: #999;
      font-size: 14px;
    }
    .main {
      display: flex;
      margin-top: 30px;
      .logo {
        height: 80px;
        width: 80px;
        border-radius: 5px;
        flex-shrink: 0;
        margin: 20px;
      }
      .content {
        flex-grow: 1;
        margin-left: 20px;
        span {
          font-size: 12px;
          line-height: 2;
        }
        p {
          font-weight: 600;
        }
        .phone {
          margin-right: 50px;
        }
      }
    }
  }
</style>
