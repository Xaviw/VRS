<template>
  <el-container>
    <CascadeLocation
      :visible="dialogVisible"
      @close="dialogVisible = false"
    ></CascadeLocation>
    <Login v-show="showLogin" @closeLogin="switchLogin(false)"></Login>
    <el-header height="70px" class="center header">
      <el-row
        type="flex"
        justify="space-between"
        align="middle"
        class="container"
        style="flex-grow: 1"
      >
        <div class="header-left">
          <el-row
            type="flex"
            align="middle"
            class="title"
            @click.native="$router.push('/')"
          >
            <img src="../assets/images/防疫.svg" class="ico" />
            <span>{{ appTitle }}</span>
          </el-row>
          <span class="geo" @click="dialogVisible = true"
            ><i class="el-icon-map-location" />{{ geoText }}</span
          >
        </div>
        <div>
          <el-button
            v-show="!isLogin"
            type="text"
            class="login"
            @click="switchLogin(true)"
            >登录/注册</el-button
          >
          <el-dropdown @command="handleMenu">
            <el-row type="flex" align="middle">
              <span class="user-name">{{ userInfo && userInfo.name }}</span>
              <el-avatar
                v-show="isLogin"
                size="large"
                :src="userInfo && userInfo.face"
              >
                <i class="el-icon-user avatar"></i>
              </el-avatar>
            </el-row>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="handleModifyInfo"
                >修改资料</el-dropdown-item
              >
              <el-dropdown-item command="handleOrderInfo"
                >订单信息</el-dropdown-item
              >
              <el-dropdown-item divided command="handleLogout">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-row>
    </el-header>
    <el-main class="main">
      <el-backtop target=".main"></el-backtop>
      <router-view></router-view>
    </el-main>
    <el-footer height="50px" class="footer center">{{ appTitle }}</el-footer>
  </el-container>
</template>

<script>
import { mapState } from "vuex";
import { logout } from "../apis/apis";
import Login from "../components/login.vue";
import { clearLogin } from "../utils/util";
import CascadeLocation from "../components/cascadeLocation.vue";
export default {
  components: { Login, CascadeLocation },
  data() {
    return {
      showLogin: false,
      dialogVisible: false,
    };
  },
  methods: {
    switchLogin(flag) {
      this.showLogin = flag;
    },
    handleMenu(command) {
      switch (command) {
        case "handleModifyInfo":
          this.$router.push("/edit-info");
          break;
        case "handleOrderInfo":
          this.$router.push("/order");
          break;
        case "handleLogout":
          logout().then(() => {
            clearLogin();
          });
          break;
      }
    },
  },
  computed: {
    ...mapState(["appTitle", "isLogin", "userInfo", "geoText"]),
  },
};
</script>

<style lang="scss" scoped>
.main {
  flex-grow: 1;
  padding: 0 20px;
}
.ico {
  width: 50px;
  height: 50px;
}
.header-left {
  display: flex;
  align-items: center;
  .geo {
    margin-left: 30px;
    cursor: pointer;
    &:hover {
      color: #4490f1;
    }
    i {
      margin-right: 5px;
    }
  }
}
.avatar {
  font-size: 1.5rem;
}
.user-name {
  margin-right: 10px;
  font-weight: bold;
}
.title {
  cursor: pointer;
  span {
    user-select: none;
    letter-spacing: 1px;
    color: #4490f1;
    margin-left: 10px;
    font-size: 20px;
  }
}
.login {
  letter-spacing: 2px;
  padding: 0 12px;
  font-weight: 700;
}
.header {
  color: #666;
  font-size: 14px;
  position: relative;
  z-index: 10;
  background: #fff;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  height: 70px;
}
.footer {
  color: #666;
  font-size: 12px;
  background: #fafafa;
  height: 50px;
  line-height: 50px;
}
</style>
