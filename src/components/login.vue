<template>
  <div class="curtain center">
    <el-row class="login-box" :gutter="1">
      <i class="el-icon-close close" @click="close()" v-show="!isBack" />
      <el-col :span="12" class="form-area center">
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="form">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="ruleForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd" v-show="targetStatus != 1">
            <el-input type="password" v-model="ruleForm.confirmPwd" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话号码" prop="mobile" v-show="targetStatus != 1">
            <el-input v-model="ruleForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item
            label="短信验证码"
            prop="confirmMessage"
            v-show="targetStatus == 3"
            style="display: flex; flex-direction: column"
          >
            <div class="flex-between">
              <el-input type="password" v-model="ruleForm.confirmMessage" autocomplete="off"></el-input>
              <el-button @click="getCode" :disabled="smsText !== '获取验证码'">{{ smsText }}</el-button>
            </div>
          </el-form-item>
          <el-form-item class="prompt" v-if="!isBack">
            <div class="flex-between" style="flex-direction: row-reverse">
              <template>
                <el-link type="primary" @click="switchStatus(2)" v-show="targetStatus == 1"
                  >还没有账号？点击注册</el-link
                >
                <el-link type="primary" @click="switchStatus(1)" v-show="targetStatus != 1">已有账号？点击登录</el-link>
              </template>
              <el-link type="primary" @click="switchStatus(3)" v-show="targetStatus == 1">忘记密码</el-link>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleLogin()" v-show="targetStatus == 1"> 登录 </el-button>
            <el-button type="primary" @click="handleRegister()" v-show="targetStatus == 2"> 注册 </el-button>
            <el-button type="primary" @click="handleReset()" v-show="targetStatus == 3"> 重置密码 </el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="12" class="info-area">
        <img src="@/assets/images/疫情退散.svg" fit="cover" />
        <span>快速预约 安全放心</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { pwd, username } from 'util/regexp';
  import { forgetPwd, getSmsCode, adminLogin, checkName, login, register } from '@/apis/apis';
  import { Message } from 'element-ui';
  export default {
    created() {
      this.isBack = this.$route.path.startsWith('/manage');
    },
    data() {
      const validateName = (rule, value, callback) => {
        if (this.targetStatus) {
          callback();
          return;
        }
        checkName(value).then(
          () => {
            callback();
          },
          () => {
            callback(new Error('该用户名已被使用！'));
          },
        );
      };
      const validatePwd = (rule, value, callback) => {
        if (!pwd.test(value)) {
          callback(new Error('密码应为6-18位，且至少包含数字、字母、特殊字符中的两种'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      const validatePwd2 = (rule, value, callback) => {
        if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        smsText: '获取验证码',
        targetStatus: 1,
        isBack: null,
        ruleForm: {
          username: '',
          password: '',
          confirmPwd: '',
          confirmMessage: '',
          mobile: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            {
              pattern: username,
              message: '用户名应为4-12位字符',
              trigger: 'blur',
            },
            { validator: validateName, trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePwd, trigger: 'blur' },
          ],
          confirmPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { validator: validatePwd2, trigger: 'blur' },
          ],
          confirmMessage: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
          mobile: [{ required: true, message: '请输入手机号码', trigger: 'blur' }],
        },
        validatePwd2,
      };
    },
    methods: {
      getCode() {
        if (!this.ruleForm.mobile) {
          Message.warning('请输入电话号号码');
          return;
        }
        getSmsCode(this.ruleForm.mobile).then(() => {
          let time = 60,
            timer;
          timer = setInterval(() => {
            if (time == 1) {
              this.smsText = '获取验证码';
              timer();
            }
            this.smsText = `${time}秒后再次获取`;
            time--;
          }, 1000);
        });
      },
      handleReset() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            forgetPwd(this.ruleForm).then(() => {
              this.switchStatus(1);
            });
          }
        });
      },
      handleLogin() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const data = { ...this.ruleForm };
            delete data.confirmPwd;
            const handleLogin = async res => {
              const { data } = res.data;
              this.$store.commit('modify', {
                userInfo: data,
                isLogin: true,
                isBack: this.isBack,
              });
              data.isBack = this.isBack;
              const { expires } = await window.cookieStore.get('user');
              window.local.set('info', JSON.stringify(data), expires);
              if (this.isBack) {
                this.$router.push('/manage/index');
              } else {
                this.close();
              }
            };
            if (this.isBack) {
              adminLogin(data).then(handleLogin);
            } else {
              login(data).then(handleLogin);
            }
          }
        });
      },
      handleRegister() {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            register(this.ruleForm).then(() => {
              this.switchStatus(1);
            });
          }
        });
      },
      switchStatus(flag) {
        this.ruleForm.password = this.ruleForm.confirmPwd = '';
        this.ruleForm.confirmMessage = '';
        this.ruleForm.mobile = '';
        this.$refs.ruleForm.clearValidate('password');
        this.$refs.ruleForm.clearValidate('confirmPwd');
        if (flag == 1) {
          delete this.rules.confirmPwd;
          delete this.rules.mobile;
        }
        if (flag == 1 || flag == 2) {
          delete this.rules.confirmMessage;
        }
        if (flag == 2 || flag == 3) {
          this.rules.confirmPwd = [
            { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: this.validatePwd2, trigger: 'blur' },
          ];
          this.rules.mobile = [{ required: true, message: '请输入电话号码', trigger: 'blur' }];
        }
        if (flag == 3) {
          this.rules.confirmMessage = [{ required: true, message: '请输入验证码', trigger: 'blur' }];
        }
        this.targetStatus = flag;
      },
      close() {
        this.$refs.ruleForm.resetFields();
        this.$emit('closeLogin');
      },
    },
    mounted() {
      this.switchStatus(this.targetStatus);
    },
  };
</script>

<style lang="scss" scoped>
  ::v-deep .el-form-item__label {
    text-align: left;
  }
  .curtain {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba($color: #000000, $alpha: 0.5);
    z-index: 10002;
  }
  .login-box {
    position: relative;
    width: 960px;
    height: 681px;
    background-color: #f7fbff;
    box-shadow: 0 1px 3px rgb(0 0 0 / 30%);
    border-radius: 4px;
    background-image: url('../assets/images/login-background.png');
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
