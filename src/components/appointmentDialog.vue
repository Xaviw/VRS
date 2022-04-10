<template>
  <el-dialog :title="title" :visible.sync="visible" :show-close="false">
    <div class="flex-between">
      <el-date-picker v-model="time" type="datetime" placeholder="选择预约时间" :disabled="refuseCheckTime">
      </el-date-picker>
      <el-button type="primary" @click="handleAddPerson" v-show="canAdd">添加人员</el-button>
    </div>
    <el-table :data="personList">
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <el-input size="mini" v-model.lazy.trim="scope.row.name"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="性别" width="90">
        <template slot-scope="scope">
          <el-select v-model="scope.row.sex" placeholder="请选择" style="width: 100%" size="mini">
            <el-option label="女" :value="1"></el-option>
            <el-option label="男" :value="0"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="身份证号码" width="220">
        <template slot-scope="scope">
          <el-input size="mini" v-model.lazy.trim="scope.row.idCard"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="70">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model.lazy.trim="scope.row.age"
            :maxlength="3"
            @input="scope.row.age = scope.row.age.replace(/[^\d]/g, '')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="联系方式" width="150">
        <template slot-scope="scope">
          <el-input
            size="mini"
            v-model.lazy.trim="scope.row.mobile"
            :maxlength="11"
            @input="scope.row.mobile = scope.row.mobile.replace(/[^\d]/g, '')"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90" v-if="canAdd">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="handleDeletePerson(scope.row.id)">删除</el-button>
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
  import { Message } from 'element-ui';
  import { appointment } from '@/apis/apis';
  import { standardTime } from 'util/util';

  export default {
    props: ['title', 'visible', 'close', 'refresh', 'hospitalId', 'vaccineSpecId', 'teamNum', 'date', 'money'],
    created() {
      if (this.$store.state.isLogin) {
        const { name, sex, mobile } = this.$store.state.userInfo;
        this.personList[0] = this.basicPerson = {
          name,
          sex,
          age: null,
          mobile,
          id: this.personId++,
        };
      }
    },
    data() {
      return {
        time: '',
        refuseCheckTime: false,
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
        const index = this.personList.findIndex(item => item.id === id);
        this.personList.splice(index, 1);
      },
      handleOrder() {
        if (!this.time) {
          Message.warning('请选择预约时间！');
          return;
        }
        if (
          this.personList.some(item => {
            let values = Object.values(item);
            if (values.includes(null) || values.includes('')) {
              return true;
            } else {
              return false;
            }
          })
        ) {
          Message.warning('请将预约信息补充完整！');
          return;
        }
        const param = {
          hospitalId: this.hospitalId,
          createId: this.$store.state.userInfo.userId,
          date: standardTime(this.time),
          vaccineSpecId: this.vaccineSpecId,
          isTeam: this.title === '组团预约',
          userInfo: this.personList.map(item => ({
            name: item.name,
            sex: item.sex,
            age: Number(item.age),
            mobile: item.mobile,
            idCard: item.idCard,
          })),
        };
        if (this.teamNum) {
          param.teamNum = this.teamNum;
        }
        appointment(param).then(res => {
          this.$emit('close');
          this.$emit('refresh');
          if (param.isTeam && res.data.data) {
            this.$notify({
              title: '预约成功',
              message: `您的组团号是：${res.data.data}，关闭后可在右上角订单管理中查看`,
              duration: 0,
            });
          }
          this.$router.push(`/pay?money=${this.money * this.personList.length}`);
        });
      },
    },
    watch: {
      visible: function (newVal) {
        if (!this.basicPerson) {
          const { name, sex, mobile } = this.$store.state.userInfo;
          this.basicPerson = {
            name,
            sex,
            age: null,
            mobile,
            id: this.personId++,
          };
        }
        if (newVal) {
          if (this.date) {
            this.time = new Date(this.date);
            this.refuseCheckTime = true;
          }
        } else {
          this.refuseCheckTime = false;
        }
        if (newVal && this.title === '家庭预约') {
          this.canAdd = true;
          if (!this.personList.length || this.personList[0].id !== 0) {
            this.personList.unshift(this.basicPerson);
          }
        } else if (newVal && this.title !== '家庭预约') {
          this.canAdd = false;
          this.personList = [this.basicPerson];
        }
      },
    },
  };
</script>

<style lang="scss" scoped>
  .flex-between {
    margin-bottom: 10px;
  }
</style>
