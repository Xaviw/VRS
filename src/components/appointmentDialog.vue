<template>
  <el-dialog :title="title" :visible.sync="visible" :show-close="false">
    <div class="flex-between">
      <el-date-picker v-model="time" type="datetime" placeholder="选择预约时间">
      </el-date-picker>
      <el-button type="primary" @click="handleAddPerson" v-show="canAdd"
        >添加人员</el-button
      >
    </div>
    <el-table :data="personList">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="90">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.sex"
            placeholder="请选择"
            style="width: 100%"
            size="mini"
          >
            <el-option label="女" :value="1"></el-option>
            <el-option label="男" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="90">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.age"
            :maxlength="3"
            oninput="value=value.replace(/[^\d]/g, '')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="联系方式">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model="scope.row.mobile"
            :maxlength="11"
            oninput="value=value.replace(/[^\d]/g, '')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" v-show="canAdd">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            @click="handleDeletePerson(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="handleOrder()">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ["title", "visible", "close", "hospitalId"],
  created() {
    const { name, sex, mobile } = this.$store.state.userInfo;
    this.personList[0] = this.basicPerson = {
      name,
      sex,
      age: null,
      mobile,
      id: this.personId++,
    };
  },
  data() {
    return {
      time: "",
      personId: 0,
      basicPerson: null,
      canAdd: false,
      personList: [],
    };
  },
  methods: {
    handleAddPerson() {
      this.personList.push({
        name: null,
        sex: null,
        age: null,
        mobile: null,
        id: this.personId++,
      });
    },
    handleDeletePerson(id) {
      const index = this.personList.findIndex((item) => item.id === id);
      this.personList.splice(index, 1);
    },
    handleOrder() {
      // const param = {
      //   hospitalId: this.hospitalId,
      //   createId: this.$store.state.userInfo.userId,
      //   date: this.time,
      //   vaccineSpecId: vId,
      //   isTeam,
      //   userInfo: [
      //     //打针人信息    个人预约就只有自己的   ，信息难得保存，每次都重新填写。
      //     {
      //       name: "旺旺",
      //       sex: 0,
      //       age: 19,
      //       mobile: "138876655637",
      //     },
      //     {
      //       name: "张三",
      //       sex: 0,
      //       age: 19,
      //       mobile: "138876655637",
      //     },
      //   ],
      // };
      // appointment().then(() => {});
    },
  },
  watch: {
    visible: function (newVal) {
      if (newVal && this.title === "家庭预约") {
        this.canAdd = true;
        if (!this.personList.length || this.personList[0].id !== 0) {
          this.personList.unshift(this.basicPerson);
        }
      } else if (newVal && this.title !== "家庭预约") {
        this.canAdd = false;
        this.personList = [this.basicPerson];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
