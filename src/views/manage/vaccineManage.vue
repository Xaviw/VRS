<template>
  <div>
    <EditVaccine
      :visible="editVisible"
      :data="editData"
      @close="editVisible = false"
      @refresh="getList"
    />
    <el-button type="primary" @click="addVaccine">添加疫苗</el-button>
    <el-table :data="list">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.specInfo"
            size="small"
            :stripe="true"
            style="width: 100%; margin-left: 48px"
          >
            <el-table-column label="规格" prop="spec"></el-table-column>
            <el-table-column label="价格">
              <template slot-scope="scope">
                <span>{{ scope.row.price | money }}</span>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="序号" width="50" type="index"></el-table-column>
      <el-table-column label="疫苗名称">
        <template slot-scope="scope">
          <span>{{
            `${scope.row.vaccineName}（共${scope.row.specInfo.length}针）`
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="介绍" prop="vaccineBrief"></el-table-column>
      <el-table-column prop="ban" label="禁用人群"></el-table-column>
      <el-table-column label="注意事项" prop="notes"></el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="editVaccine(scope.row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确定删除吗？"
            @confirm="deleteVaccine(scope.row.vaccineId)"
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
import { deleteVaccine, getAllVaccine } from "../../apis/apis";
import { deepClone, money } from "../../utils/util";
import EditVaccine from "../../components/editVaccine.vue";

export default {
  created() {
    this.getList();
  },
  data: function () {
    return {
      list: [],
      editVisible: false,
      editData: {},
    };
  },
  methods: {
    getList() {
      getAllVaccine().then((res) => {
        this.list = res.data.data.data;
      });
    },
    editVaccine(data) {
      this.editData = deepClone(data);
      this.editVisible = true;
    },
    addVaccine() {
      this.editData = { specInfo: [] };
      this.editVisible = true;
    },
    deleteVaccine(id) {
      deleteVaccine(id).then(() => {
        this.getList();
      });
    },
  },
  filters: { money },
  components: { EditVaccine },
};
</script>

<style scoped lang="scss"></style>
