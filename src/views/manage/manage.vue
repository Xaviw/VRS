<template>
  <el-tabs type="border-card" class="mt-40">
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
</template>

<script>
import VaccineManage from "./vaccineManage.vue";
import HospitalManage from "./hospitalManage.vue";
import UserManage from "./userManage.vue";
export default {
  data: function () {
    return {};
  },
  components: { VaccineManage, HospitalManage, UserManage },
};
</script>

<style scoped lang="scss"></style>
