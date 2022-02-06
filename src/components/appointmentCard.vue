<template>
  <el-card class="box-card">
    <AppointmentDialog
      title="组团预约"
      :visible="visible"
      @close="visible = false"
      :hospitalId="data.hospitalId"
      :vaccineSpecId="data.vaccineSpecId"
      :teamNum="teamNum"
    ></AppointmentDialog>
    <div slot="header" class="header flex-between">
      <p>{{ data.vaccineName + (data.spec ? `（${data.spec}）` : "") }}</p>
      <el-button type="text" @click="visible = true">加入组团</el-button>
    </div>
    <div class="main">
      <div class="left">
        <p class="vaccineBrief">
          疫苗介绍：<br />{{ data.vaccineBrief || "无" }}
        </p>
        <p class="notes">注意事项：<br />{{ data.notes || "无" }}</p>
        <p class="ban">禁用人群：<br />{{ data.ban || "无" }}</p>
      </div>
      <div class="right">
        <p>
          接种地点：<br /><el-link
            type="primary"
            @click="$router.push('/hospital/' + data.hospitalId)"
            >{{ data.hospitalName }}</el-link
          >
        </p>
        <p>接种时间：<br />{{ data.date }}</p>
        <p>当前组团人数： {{ data.isJoin }}</p>
        <p>价格：{{ data.price || "免费" }}￥</p>
      </div>
    </div>
  </el-card>
</template>

<script>
import AppointmentDialog from "./appointmentDialog.vue";
export default {
  props: ["data", "teamNum"],
  components: { AppointmentDialog },
  data() {
    return {
      visible: false,
    };
  },
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
    }
  }
}
</style>
