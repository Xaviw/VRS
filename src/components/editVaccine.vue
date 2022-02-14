<template>
  <el-dialog
    title="编辑"
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    top="0"
  >
    <el-form ref="form" :model="data" label-width="80px">
      <el-form-item label="疫苗名称">
        <el-input v-model="data.vaccineName"></el-input>
      </el-form-item>
      <el-form-item label="疫苗介绍">
        <el-input type="textarea" v-model="data.vaccineBrief"></el-input>
      </el-form-item>
      <el-form-item label="禁用人群">
        <el-input type="textarea" v-model="data.ban"></el-input>
      </el-form-item>
      <el-form-item label="注意事项">
        <el-input type="textarea" v-model="data.notes"></el-input>
      </el-form-item>
    </el-form>
    <el-table :data="data.specInfo" :stripe="true">
      <el-table-column label="规格">
        <template slot-scope="scope">
          <el-input v-model="scope.row.spec"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          <el-input type="number" v-model="scope.row.price"></el-input>
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
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="medium"
            @click="handleDeleteSpec(scope.row.vaccineSpecId)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-button class="add" @click="handleAppendSpec"
      ><i class="el-icon-circle-plus-outline"></i>增加规格</el-button
    >
    <span slot="footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleEdit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { modifyVaccineInfo } from "@/apis/apis";

export default {
  props: ["visible", "close", "data", "refresh"],
  data() {
    return {};
  },
  methods: {
    handleEdit() {
      this.data.specInfo.forEach((item) => {
        delete item.vaccineSpecId;
        if (typeof item.price !== "number") {
          item.price = Number(item.price);
        }
      });
      modifyVaccineInfo(this.data).then(() => {
        this.$emit("close");
        this.$emit("refresh");
      });
    },
    handleDeleteSpec(id) {
      const list = this.data.specInfo;
      const index = list.findIndex((item) => item.vaccineSpecId === id);
      list.splice(index, 1);
    },
    handleAppendSpec() {
      this.data.specInfo.push({
        vaccineSpecId: Symbol(),
        spec: null,
        price: null,
        inventory: null,
        date: null,
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  height: 90%;
  width: 80%;
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
.add {
  margin-top: 20px;
  width: 300px;
  i {
    margin-right: 10px;
  }
}
</style>
