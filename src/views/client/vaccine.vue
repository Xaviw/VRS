<template>
  <div class="container">
    <AppointmentDialog
      :visible="orderParam.visible"
      :title="orderParam.title"
      :hospitalId="orderParam.hospitalId"
      :vaccineSpecId="orderParam.vaccineSpecId"
      @close="orderParam.visible = false"
      @refresh="handleSearch"
      :money="data[0].price"
    ></AppointmentDialog>
    <p class="title">
      能够预约<span class="name">{{ vaccineName }} {{ specName }}</span
      >的医院：
    </p>
    <template v-if="data.length">
      <el-descriptions v-for="item of data" :key="item.hospitalId">
        <template slot="title">
          <span class="hospitalName" @click="$router.push('/hospital/' + item.hospitalId)">{{
            item.hospitalName
          }}</span>
        </template>
        <template slot="extra">
          <el-button size="mini" type="primary" @click="handleOrder('个人预约', item.hospitalId, item.vaccineSpecId)"
            >个人预约</el-button
          >
          <el-button size="mini" type="primary" @click="handleOrder('家庭预约', item.hospitalId, item.vaccineSpecId)"
            >家庭预约</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleOrder('组团预约', item.hospitalId, item.vaccineSpecId)"
            v-if="isGroup"
            >组团预约</el-button
          >
        </template>
        <el-descriptions-item label="价格">{{ item.price }}</el-descriptions-item>
        <el-descriptions-item label="库存">{{ item.inventory }}</el-descriptions-item>
        <el-descriptions-item label="等级">{{ item.grade }}</el-descriptions-item>
        <el-descriptions-item label="地址">{{ item.address }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ item.mobile }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话2" v-if="item.mobileBk">{{ item.mobileBk }}</el-descriptions-item>
        <el-descriptions-item label="工作时间"> {{ item.workTime }}-{{ item.closeTime }} </el-descriptions-item>
        <el-descriptions-item label="介绍">{{ item.hospitalBrief }}</el-descriptions-item>
      </el-descriptions>
    </template>
    <el-empty v-else description="无此疫苗相关医院..." style="min-height: 90vh"></el-empty>
    <i id="bottomAnchor"></i>
  </div>
</template>

<script>
  import AppointmentDialog from 'com/appointmentDialog.vue';
  import { getHospitalByVaccine } from '@/apis/apis';
  import { Message } from 'element-ui';
  import qs from 'qs';
  export default {
    components: { AppointmentDialog },
    created() {
      let isGroup, name, spec, vaccineSpecId;
      try {
        ({ isGroup, name, spec, vaccineSpecId } = qs.parse(decodeURIComponent(window.atob(this.$route.query.params))));
        this.vaccineSpecId = vaccineSpecId;
      } catch {
        //
      } finally {
        if ([isGroup, name, spec].includes(undefined)) {
          Message.warning('参数错误！');
          this.$router.replace('/');
        }
      }
      this.isGroup = isGroup;
      this.vaccineName = name;
      this.specName = spec;
      this.handleSearch();
    },
    mounted() {
      this.observer = new IntersectionObserver(
        entries => {
          const ratio = entries[0].intersectionRatio;
          if (ratio > 0) {
            this.handleSearch();
          }
        },
        { threshold: 0.1 },
      );

      this.observer.observe(document.getElementById('bottomAnchor'));
    },
    beforeDestroy() {
      if (this.observer) {
        this.observer.disconnect();
      }
    },
    data: function () {
      return {
        observer: null,
        isGroup: null,
        vaccineName: null,
        specName: null,
        data: [],
        total: null,
        param: null,
        orderParam: {},
        vaccineSpecId: null,
      };
    },
    methods: {
      handleSearch() {
        let len = this.data.length;
        if (this.total == null || len < this.total) {
          const page = this.data.length / 20 + 1;
          const data = {
            id: this.$route.params.id,
            page,
            pageSize: 20,
          };
          if (this.$store.state.geo) data.area = this.$store.state.geo;

          if (JSON.stringify(this.param) !== JSON.stringify(data)) {
            this.param = data;
            getHospitalByVaccine(data).then(res => {
              this.total = res.data.data.total;
              this.data = [...this.data, ...res.data.data.data];
            });
          }
        }
      },
      handleOrder(title, hospitalId, vaccineSpecId) {
        if (this.$store.state.isLogin) {
          this.orderParam = {
            visible: true,
            title,
            hospitalId,
            vaccineSpecId,
          };
        } else {
          Message.info('请先点击右上角登录！');
        }
      },
    },
    watch: {
      '$store.state.geo': {
        handler: function (newVal) {
          if (newVal) {
            this.data = [];
            this.total = null;
            this.handleSearch(true);
          }
        },
      },
    },
  };
</script>

<style scoped lang="scss">
  #bottomAnchor {
    display: block;
    margin-top: -100px;
  }
  .container {
    position: relative;
    .hospitalName {
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      &:hover {
        color: #4490f1;
      }
    }
    .title {
      padding-top: 30px;
      letter-spacing: 1px;
      font-weight: 700;
      color: #333;
      font-size: 16px;
      .name {
        color: #4490f1;
      }
    }
    .el-descriptions {
      margin: 30px 0;
      padding: 20px;
      box-shadow: 0 4px 20px 0 rgb(0 0 0 / 4%);
    }
  }
</style>
