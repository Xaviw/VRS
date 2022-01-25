<template>
  <div class="curtain">
    <el-row class="login-box" :gutter="1">
      <i class="el-icon-close close" @click="close()" />
      <el-col :span="12" class="form-area center">
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          class="form"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="confirmPwd"
            v-show="!isLoginStatus"
          >
            <el-input
              type="password"
              v-model="ruleForm.confirmPwd"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item class="prompt">
            <el-link
              type="primary"
              @click="switchStatus(false)"
              v-show="isLoginStatus"
              >还没有账号？点击注册</el-link
            >
            <el-link
              type="primary"
              @click="switchStatus(true)"
              v-show="!isLoginStatus"
              >已有账号？点击登录</el-link
            >
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="handleLogin()"
              v-show="isLoginStatus"
            >
              登录
            </el-button>
            <el-button
              type="primary"
              @click="handleRegister()"
              v-show="!isLoginStatus"
            >
              注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="info-area">
        <img src="../assets/images/疫情退散.svg" fit="cover" />
        <span>快速预约 安全放心</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { pwd, username } from "util/regexp";
import { checkName, login, register } from "../apis/apis";
export default {
  data() {
    const validateName = (rule, value, callback) => {
      if (this.isLoginStatus) {
        callback();
        return;
      }
      checkName(value).then(
        () => {
          callback();
        },
        () => {
          callback(new Error("该用户名已被使用！"));
        }
      );
    };
    const validatePwd = (rule, value, callback) => {
      if (!pwd.test(value)) {
        callback(
          new Error("密码应为6-18位，且至少包含数字、字母、特殊字符中的两种")
        );
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePwd2 = (rule, value, callback) => {
      if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      isLoginStatus: true,
      ruleForm: {
        username: "",
        password: "",
        confirmPwd: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            pattern: username,
            message: "用户名应为4-12位字符",
            trigger: "blur",
          },
          { validator: validateName, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
        confirmPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePwd2, trigger: "blur" },
        ],
      },
      validatePwd2,
    };
  },
  methods: {
    handleLogin() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const data = { ...this.ruleForm };
          delete data.confirmPwd;
          login(data).then(async (res) => {
            const { data } = res.data;
            this.$store.commit("modify", { userInfo: data, isLogin: true });
            const { expires } = await window.cookieStore.get("user");
            window.local.set("info", JSON.stringify(data), expires);
            this.close();
          });
        }
      });
    },
    handleRegister() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          register(this.ruleForm).then(() => {
            this.ruleForm.password = this.ruleForm.confirmPwd = "";
            this.$refs.ruleForm.clearValidate("password");
            this.$refs.ruleForm.clearValidate("confirmPwd");
            this.isLoginStatus = true;
          });
        }
      });
    },
    switchStatus(flag) {
      this.ruleForm.password = this.ruleForm.confirmPwd = "";
      this.$refs.ruleForm.clearValidate("password");
      this.$refs.ruleForm.clearValidate("confirmPwd");
      if (flag) {
        delete this.rules.confirmPwd;
      } else {
        this.rules.confirmPwd = [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          { validator: this.validatePwd2, trigger: "blur" },
        ];
      }
      this.isLoginStatus = flag;
    },
    close() {
      this.$refs.ruleForm.resetFields();
      this.$emit("closeLogin");
    },
  },
  mounted() {
    this.switchStatus(this.isLoginStatus);
  },
};
</script>

<style lang="scss" scoped>
.curtain {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba($color: #000000, $alpha: 0.5);
  z-index: 99;
}
.login-box {
  position: relative;
  width: 960px;
  height: 581px;
  background-color: #f7fbff;
  box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
  border-radius: 4px;
  background-image: url("../assets/images/login-background.png");
  background-repeat: repeat;
  padding: 25px;
}
.close {
  position: absolute;
  right: 10px;
  top: 10px;
  font-size: 1.1rem;
  cursor: pointer;
  border: 8px solid transparent;
  background-clip: padding-box;
  &:hover {
    color: #409eff;
  }
}
.form-area {
  padding: 0 50px !important;
  color: #606266;
  font-size: 14px;
  word-break: break-all;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 20px 0 rgba(73, 144, 241, 0.2);
}
.info-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  img {
    height: 400px;
  }
  span {
    margin-top: 30px;
    font-size: 20px;
    font-weight: 300;
    font-style: italic;
    letter-spacing: 4px;
    color: #000;
    line-height: 44px;
  }
}
.form {
  width: 100%;
  button {
    width: 100%;
  }
  .prompt {
    text-align: right;
  }
}
</style>
