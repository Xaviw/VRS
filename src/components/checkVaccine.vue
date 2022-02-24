<template>
  <el-dialog
    :title="title"
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="0"
  >
    <el-select
      v-model="vaccineName"
      filterable
      placeholder="请选择或搜索疫苗"
      @change="handleChange($event)"
      style="width: 100%; margin-bottom: 10px"
      v-show="!vaccineData"
    >
      <el-option
        v-for="item in vaccineList"
        :key="item.vaccineId"
        :label="item.vaccineName"
        :value="item"
      >
      </el-option>
    </el-select>
    <el-table :data="info && info.specInfo" :stripe="true">
      <el-table-column label="规格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.spec" :disabled="true"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <el-input
            type="number"
            v-model="scope.row.price"
            :disabled="true"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="库存">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.inventory"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="预约开始时间" width="203">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.date"
            type="datetime"
            placeholder="选择日期时间"
            style="width: 193px"
          >
          </el-date-picker>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Message } from "element-ui";
import { getAllVaccine, checkVaccine } from "../apis/apis";
import { deepClone, standardTime } from "../utils/util";

export default {
  props: ["visible", "close", "refresh", "title", "vaccineData"],
  created() {
    getAllVaccine().then((res) => {
      this.vaccineList = res.data.data.data;
    });
  },
  data() {
    return {
      vaccineList: [],
      vaccineName: "",
      info: null,
    };
  },
  methods: {
    handleEdit() {
      if (
        this.info &&
        this.info.specInfo.some((item) => {
          return Object.values(item).includes(undefined);
        })
      ) {
        Message.warning("请补充信息！");
        return;
      }
      let params = {
        vaccineId: this.vaccineData
          ? this.vaccineData.vaccineId
          : this.info.vaccineId,
        hospitalId: this.$store.state.userInfo.hospitalId,
      };
      params.vaccineInfo = this.info.specInfo.map((item) => {
        item.date = standardTime(item.date);
        return item;
      });
      checkVaccine(params).then(() => {
        this.$emit("close");
        this.$emit("refresh");
      });
    },
    handleChange(e) {
      e.specInfo = e.specInfo.map((item) => {
        return { ...item, inventory: 0, date: Date.now() };
      });
      this.info = e;
    },
  },
  watch: {
    vaccineData: {
      handler: function (val) {
        if (val) this.info = deepClone(val);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  width: 60%;
  min-width: 650px;
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .el-dialog__body {
    flex-grow: 1;
    overflow: auto;
    text-align: center;
  }
}
</style>
