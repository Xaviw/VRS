<template>
  <el-table :data="list">
    <el-table-column label="序号" width="50" type="index"></el-table-column>
    <el-table-column label="用户名" prop="name" show-overflow-tooltip></el-table-column>
    <el-table-column label="性别" width="120">
      <template slot-scope="scope">
        {{ scope.row.sex ? '女' : '男' }}
      </template>
    </el-table-column>
    <el-table-column prop="mobile" label="联系方式" width="150"></el-table-column>
    <el-table-column label="操作" width="200">
      <template slot-scope="scope">
        <el-popconfirm title="确定删除吗？" @confirm="deleteUser(scope.row.userId)">
          <el-button size="mini" slot="reference" type="danger">删除</el-button>
        </el-popconfirm>
        <el-popconfirm title="确定重置密码吗？" @confirm="resetPwd(scope.row.userId)" style="margin-left: 10px">
          <el-button size="mini" slot="reference">重置密码</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { getAllUser, deleteUser, resetPwd } from '@/apis/apis';
  export default {
    created() {
      this.getList();
    },
    data() {
      return {
        list: [],
      };
    },
    methods: {
      getList() {
        getAllUser().then(res => {
          this.list = res.data.data;
        });
      },
      deleteUser(id) {
        deleteUser(id).then(() => {
          this.getList();
        });
      },
      resetPwd(id) {
        resetPwd(id);
      },
    },
  };
</script>
