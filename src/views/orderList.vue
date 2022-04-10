<template>
  <div class="container">
    <div class="header">
      <span class="title title-block">订单信息</span>
      <span class="status">状态：</span>
      <el-radio-group v-model="status" @change="getPageData" size="small">
        <el-radio-button label="全部"></el-radio-button>
        <el-radio-button label="预约成功"></el-radio-button>
        <el-radio-button label="已完成"></el-radio-button>
        <el-radio-button label="待组团"></el-radio-button>
        <el-radio-button label="已取消"></el-radio-button>
      </el-radio-group>
    </div>
    <div class="main">
      <el-table :data="dataList">
        <el-table-column label="序号" width="50" type="index"></el-table-column>
        <el-table-column prop="vaccineName" label="疫苗名称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="vaccineSpec" label="针次" width="100" show-overflow-tooltip></el-table-column>
        <el-table-column label="价格" width="100">
          <template slot-scope="scope">{{ scope.row.price | money }}</template>
        </el-table-column>
        <el-table-column prop="hospitalName" label="预约医院" show-overflow-tooltip></el-table-column>
        <el-table-column label="预约日期" prop="date" show-overflow-tooltip></el-table-column>
        <el-table-column label="下单日期" prop="createTime" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template slot-scope="scope"
            >{{
              scope.row.isTeam
                ? `${scope.row.status}${scope.row.teamStatus ? '(' + scope.row.teamStatus + ')' : ''}`
                : scope.row.status
            }}
          </template>
        </el-table-column>
        <el-table-column label="团内成员" show-overflow-tooltip>
          <template slot-scope="scope"
            >{{ scope.row.isTeam ? scope.row.userInfo.map(item => item.userName).join('，') : '------' }}
          </template>
        </el-table-column>
        <el-table-column label="组团号" width="100px">
          <template slot-scope="scope">
            {{ scope.row.isTeam ? scope.row.teamNum : '------' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px" v-if="!['已完成', '已取消'].includes(status)">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleCancel(scope.row.orderId)"
              v-show="!['已完成', '已取消'].includes(scope.row.status)"
              >取消预约</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="footer">
      <el-pagination
        @size-change="getPageData({ type: 'size', data: $event })"
        @current-change="getPageData({ type: 'page', data: $event })"
        :current-page="page"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :hide-on-single-page="true"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { cancelOrder, getOrders } from '@/apis/apis';
  import { money } from 'util/util';
  export default {
    created() {
      this.getPageData();
    },
    data() {
      return {
        dataList: [],
        page: 1,
        pageSize: 20,
        total: 0,
        status: '全部',
      };
    },
    methods: {
      getPageData(e) {
        if (e && e.type == 'size') {
          this.pageSize = e.data;
        } else if (e && e.type == 'page') {
          this.page = e.data;
        }
        const param = {
          page: this.page,
          pageSize: this.pageSize,
          userId: this.$store.state.userInfo.userId,
        };
        if (this.getStatus) param.status = this.getStatus;
        getOrders(param).then(res => {
          this.dataList = res.data.data.data;
          if (this.total != res.data.data.total) {
            this.total = res.data.data.total;
          }
        });
      },
      handleCancel(id) {
        cancelOrder(id).then(() => {
          this.getPageData();
        });
      },
    },
    computed: {
      getStatus() {
        switch (this.status) {
          case '预约成功':
            return 1;
          case '已完成':
            return 2;
          case '待组团':
            return 3;
          case '已取消':
            return 4;
          default:
            return null;
        }
      },
    },
    filters: {
      money,
    },
  };
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    flex-direction: column;
    .header {
      .title {
        letter-spacing: 1px;
        font-weight: 700;
        color: #333;
        font-size: 16px;
        padding: 40px 0 20px 15px;
        display: block;
      }
    }
    .main {
      flex-grow: 1;
      overflow: auto;
      padding: 10px;
    }
    .footer {
      text-align: center;
      border-top: 1px solid #ebeef5;
    }
  }
</style>
