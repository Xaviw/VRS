<template>
  <div class="card-item flex-between" @click="gotoDetail">
    <div class="left">
      <span class="name">{{ item.name }}</span>
      <span class="grade ellipsis-line"
        ><i class="el-icon-aim" />{{
          type == "医院信息" ? item.grade : item.brief
        }}</span
      >
    </div>
    <img class="right" :src="item.logo" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["item", "type"],
  methods: {
    gotoDetail() {
      if (this.type == "医院信息") {
        this.$router.push(`/hospital/${this.item.id}`);
      } else {
        this.$router.push(`/vaccine/${this.item.id}`);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.card-item {
  max-width: 440px;
  min-width: 300px;
  height: 98px;
  margin: 10px;
  box-shadow: 0 4px 20px 0 rgb(0 0 0 / 4%);
  flex: 1 1;
  box-sizing: border-box;
  margin-top: 30px;
  padding: 20px;
  cursor: pointer;
  background: #fff;
  &:hover {
    box-shadow: 0 4px 20px 0 rgb(0 0 0 / 10%);
    .left .name {
      color: #000;
      font-weight: 800;
    }
  }
  .left {
    height: 100%;
    display: flex;
    min-width: 0;
    flex-direction: column;
    justify-content: space-between;
    .name {
      font-weight: 500;
      font-size: 16px;
    }
    .grade {
      color: #999;
      i {
        margin-right: 5px;
      }
    }
  }
  .right {
    width: 80px;
    height: 80px;
  }
}
</style>
