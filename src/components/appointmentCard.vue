<template>
  <el-card class="box-card">
    <AppointmentDialog
      title="组团预约"
      :visible="visible"
      @close="visible = false"
      :hospitalId="data.hospitalId"
      :vaccineSpecId="data.vaccineSpecId"
      :date="data.date"
      :teamNum="teamNum"
      :money="data.price"
      v-if="isGroupInfo"
    ></AppointmentDialog>
    <div slot="header" class="header flex-between">
      <p>
        {{ data.vaccineName + (isGroupInfo ? (data.spec ? `（${data.spec}）` : '') : '') }}
      </p>
      <el-button type="text" @click="joinGroup" v-if="isGroupInfo">加入组团</el-button>
    </div>
    <div class="main">
      <div class="left">
        <p class="vaccineBrief">
          疫苗介绍：<br /><span class="ellipsis-2" :title="data.vaccineBrief || '无'">{{
            data.vaccineBrief || '无'
          }}</span>
        </p>
        <p class="notes">
          注意事项：<br /><span class="ellipsis-2" :title="data.notes || '无'">{{ data.notes || '无' }}</span>
        </p>
        <p class="ban">
          禁用人群：<br />
          <span class="ellipsis-2" :title="data.ban || '无'">{{ data.ban || '无' }}</span>
        </p>
        <p class="notes">
          <span style="margin-right: 10px">类别：{{ data.type ? '儿童' : '成人' }}</span>
          <span style="margin-right: 10px">生产厂家：{{ data.factory }}</span>
          <span>生产日期：{{ data.productDate }}</span>
        </p>
      </div>
      <div class="right" v-if="isGroupInfo">
        <p>
          接种地点：<br /><el-link type="primary" @click="$router.push('/hospital/' + data.hospitalId)">{{
            data.hospitalName
          }}</el-link>
        </p>
        <p>接种时间：<br />{{ data.date }}</p>
        <p>当前组团人数： {{ data.isJoin }}</p>
        <p>价格：{{ data.price || '免费' }}￥</p>
      </div>
      <div class="right center" v-if="data.logo">
        <img :src="data.logo" alt="logo" v-if="!isGroupInfo" />
      </div>
    </div>
    <el-collapse v-if="!isGroupInfo">
      <el-collapse-item title="疫苗规格" name="spec">
        <el-table :data="data.specInfo">
          <el-table-column label="序号" width="50" type="index"></el-table-column>
          <el-table-column label="规格" prop="spec"> </el-table-column>
          <el-table-column label="价格">
            <template slot-scope="scope">
              <span>{{ scope.row.price | money }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="gotoVaccineHospital(scope.row)">查看预约</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>

<script>
  import { Message } from 'element-ui';
  import AppointmentDialog from './appointmentDialog.vue';
  import { money } from 'util/util';
  import qs from 'qs';
  export default {
    props: ['data', 'teamNum', 'isGroupInfo'],
    components: { AppointmentDialog },
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      joinGroup() {
        if (this.$store.state.isLogin) {
          this.visible = true;
        } else {
          Message.warning('请先登录');
        }
      },
      gotoVaccineHospital({ vaccineSpecId, spec }) {
        let str = qs.stringify({
          isGroup: this.data.isGroup,
          name: this.data.vaccineName,
          spec,
          vaccineSpecId,
        });
        str = encodeURIComponent(str);
        const query = window.btoa(str);
        this.$router.push(`/vaccine/${vaccineSpecId}?params=${query}`);
      },
    },
    filters: { money },
  };
</script>

<style lang="scss" scoped>
  .box-card {
    .header {
      font-weight: bold;
      font-size: 16px;
      p,
      button {
        margin: 0;
        padding: 0;
      }
    }
    .main {
      display: flex;
      line-height: 1.5;
      p {
        margin: 10px 0;
      }
      .left {
        flex-grow: 1;
        .vaccineBrief {
          color: #909399;
        }
        .ban {
          font-weight: bold;
          color: #f56c6c;
        }
      }
      .right {
        margin-left: 15px;
        padding-left: 15px;
        border-left: 1px solid #eee;
        min-width: 160px;
        img {
          width: 80px;
          height: 80px;
        }
      }
    }
  }
</style>
