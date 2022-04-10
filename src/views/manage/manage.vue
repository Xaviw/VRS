<template>
  <div class="container">
    <el-tabs type="border-card">
      <el-tab-pane label="疫苗管理">
        <VaccineManage />
      </el-tab-pane>
      <el-tab-pane label="医院管理">
        <HospitalManage />
      </el-tab-pane>
      <el-tab-pane label="用户管理">
        <UserManage />
      </el-tab-pane>
    </el-tabs>
    <Info />
  </div>
</template>

<script>
  import VaccineManage from './vaccineManage.vue';
  import HospitalManage from './hospitalManage.vue';
  import UserManage from './userManage.vue';
  import Info from '../../components/info.vue';
  export default {
    data: function () {
      return {};
    },
    components: { VaccineManage, HospitalManage, UserManage, Info },
  };
</script>

<style scoped lang="scss">
  .container {
    display: grid;
    grid-template-columns: 1fr auto;
    column-gap: 40px;
    margin: 20px auto;
  }
</style>
