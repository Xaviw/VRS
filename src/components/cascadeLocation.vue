<template>
  <el-dialog title="选择地区" :visible.sync="visible" :show-close="false">
    <el-cascader-panel
      :options="options"
      :props="props"
      width="550px"
      v-model="area"
    ></el-cascader-panel>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleAreaCancel()">取 消</el-button>
      <el-button type="primary" @click="handleAreaChange()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { geo } from "@/assets/geo";
export default {
  props: ["visible", "close"],
  data() {
    return {
      options: geo,
      props: {
        checkStrictly: true,
        value: "label",
      },
      area: [],
    };
  },
  methods: {
    handleAreaChange() {
      this.$store.commit("modify", {
        geoText: this.area.join(" "),
        geo: this.area[this.area.length - 1],
      });
      this.$emit("close");
    },
    handleAreaCancel() {
      this.area = [];
      this.$emit("close");
    },
  },
};
</script>
