<template>
  <div>
    <EditHospital
      :visible="editVisible"
      :title="editTitle"
      :data="editData"
      @close="editVisible = false"
      @refresh="getList"
    />
    <el-button type="primary" @click="addHospital">增加医院</el-button>
    <el-table :data="list">
      <el-table-column label="序号" width="50" type="index"></el-table-column>
      <el-table-column label="名称" prop="hospitalName"></el-table-column>
      <el-table-column label="等级" prop="grade" width="120"></el-table-column>
      <el-table-column
        prop="mobile"
        label="联系方式"
        width="150"
      ></el-table-column>
      <el-table-column
        label="备用联系方式"
        prop="mobileBk"
        width="150"
      ></el-table-column>
      <el-table-column label="地区" prop="area"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editHospital(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteHospital(scope.row.hospitalId)"
            style="margin-left: 10px"
          >
            <el-button size="mini" slot="reference" type="danger"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllHospital } from "@/apis/apis";
import { deleteHospital } from "../../apis/apis";
import EditHospital from "com/editHospital.vue";
import { deepClone } from "../../utils/util";
export default {
  created() {
    this.getList();
  },
  data: function () {
    return {
      list: [],
      editVisible: false,
      editTitle: "",
      editData: {},
    };
  },
  methods: {
    getList() {
      getAllHospital().then((res) => {
        this.list = res.data.data;
      });
    },
    addHospital() {
      this.editTitle = "添加医院";
      this.editData = {};
      this.editVisible = true;
    },
    deleteHospital(id) {
      deleteHospital(id).then(() => {
        this.getList();
      });
    },
    editHospital(data) {
      this.editTitle = "编辑医院信息";
      this.editData = deepClone(data);
      this.editVisible = true;
    },
  },
  components: { EditHospital },
};
</script>
