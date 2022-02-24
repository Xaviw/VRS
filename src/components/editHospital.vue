<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <CascadeLocation
      :visible="geoVisible"
      @close="geoVisible = false"
      @modify="modifyArea"
      :isModify="true"
    />
    <el-form ref="form" :model="data" label-width="100px">
      <el-form-item label="医院名称">
        <el-input v-model.trim="data.hospitalName"></el-input>
      </el-form-item>
      <el-form-item label="医院等级">
        <el-input v-model.trim="data.grade"></el-input>
      </el-form-item>
      <el-form-item label="所在地区">
        <el-input
          v-model.trim="data.area"
          readonly
          @click.native="geoVisible = true"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addHospital } from "@/apis/apis";
import { Message } from "element-ui";
import CascadeLocation from "./cascadeLocation.vue";
export default {
  props: ["visible", "close", "refresh", "title", "data"],
  data: function () {
    return { geoVisible: false };
  },
  methods: {
    handleEdit() {
      if (!this.data.hospitalName || !this.data.grade || !this.data.area) {
        Message.warning("请将信息补充完整！");
        return;
      }
      const param = {
        ...this.data,
      };
      addHospital(param).then(() => {
        this.$emit("close");
        this.$emit("refresh");
      });
    },
    modifyArea(e) {
      this.data.area = e;
      this.geoVisible = false;
    },
  },
  components: { CascadeLocation },
};
</script>
