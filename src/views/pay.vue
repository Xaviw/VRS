<template>
  <div style="padding: 30px; text-align: center" class="container">
    <template v-if="flag">
      <div style="display: flex; align-items: center" class="pay-box">
        <i class="el-icon-circle-check" style="color: #1890ff; margin-right: 60px; font-size: 4rem"></i>
        <div style="text-align: left">
          <p>您的订单已提交成功！请尽快付款</p>
          <p>
            金额：<span class="money">￥{{ money }}</span>
          </p>
        </div>
      </div>
      <el-button type="primary" style="margin-top: 40px" @click="handlePay">立即支付</el-button>
    </template>
    <el-result v-else icon="success" title="支付成功" subTitle="您可以通过右上角前往订单中心查看该订单"> </el-result>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flag: true,
        money: '',
      };
    },
    mounted() {
      this.money = this.$route.query.money;
    },
    methods: {
      handlePay() {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        });
        setTimeout(() => {
          loading.close();
          this.flag = false;
        }, 2000);
      },
    },
  };
</script>

<style lang="scss">
  .pay-box {
    background-color: #f5f5f5;
    padding: 20px 30px;
  }
  .money {
    color: #f65301;
    font-size: 2rem;
    font-weight: bold;
  }
</style>
