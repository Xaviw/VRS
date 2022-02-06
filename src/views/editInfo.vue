<template>
  <div class="container">
    <el-upload
      class="avatar-uploader"
      action="/api/info/editFace"
      :data="{ userId: $store.state.userInfo.userId }"
      :multiple="false"
      :show-file-list="false"
      accept=".jpg,.jpeg,.png"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <el-avatar v-if="imageUrl" size="large" :src="imageUrl" class="avatar">
        <i class="el-icon-user avatar"></i>
      </el-avatar>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="form"
      label-width="80px"
    >
      <el-form-item label="用户名">
        <el-input :value="$store.state.userInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select
          v-model="ruleForm.sex"
          placeholder="请选择"
          style="width: 100%"
        >
          <el-option label="女" :value="1"></el-option>
          <el-option label="男" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input v-model="ruleForm.mobile" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password" v-if="includePwd">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd" v-if="includePwd">
        <el-input
          type="password"
          v-model="ruleForm.confirmPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item class="submit-item">
        <button class="modify-pwd" @click="includePwd = !includePwd">
          <i
            :class="
              includePwd
                ? 'el-icon-remove-outline'
                : 'el-icon-circle-plus-outline'
            "
          ></i
          >{{ includePwd ? "取消修改密码" : "修改密码" }}
        </button>
      </el-form-item>
      <el-form-item
        ><el-button type="primary" @click="handleSubmit">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { pwd, mobilePhone } from "util/regexp";
import { modifyInfo } from "@/apis/apis";
import { clearLogin } from "util/util";
export default {
  created() {
    if (this.$store.state.userInfo) {
      this.imageUrl = this.$store.state.userInfo.face;
      this.ruleForm.mobile = this.$store.state.userInfo.mobile;
      this.ruleForm.sex = this.$store.state.userInfo.sex;
    }
  },
  data() {
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
      imageUrl: null,
      includePwd: false,
      ruleForm: {
        password: "",
        confirmPwd: "",
        mobile: "",
        sex: null,
      },
      rules: {
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePwd, trigger: "blur" },
        ],
        confirmPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePwd2, trigger: "blur" },
        ],
        mobile: [
          {
            pattern: mobilePhone,
            message: "请正确输入电话号码",
            trigger: "blur",
          },
        ],
      },
      validatePwd2,
    };
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["jpg", "jpeg", "png"];

      const isImg = whiteList.indexOf(fileSuffix.toLowerCase()) !== -1;

      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isImg) {
        this.$message.error("仅支持jpg、jpeg、png格式的头像");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isImg && isLt2M;
    },
    handleSubmit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (
            !this.includePwd &&
            this.ruleForm.mobile == this.$store.state.userInfo.mobile &&
            this.ruleForm.sex == this.$store.state.userInfo.sex
          ) {
            Message.warning("未修改任何信息！");
            return;
          }
          const info = { ...this.ruleForm };
          info.userId = this.$store.state.userInfo.userId;
          if (!this.includePwd) {
            delete info.password;
            delete info.confirmPwd;
          }
          modifyInfo(info).then(() => {
            if (this.includePwd) {
              clearLogin();
            } else {
              this.$store.commit("modify", {
                userInfo: {
                  ...this.$store.state.userInfo,
                  mobile: this.ruleForm.mobile,
                  sex: this.ruleForm.sex,
                },
              });
              this.ruleForm.password = this.ruleForm.confirmPwd = null;
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 40px;
  text-align: center;
  width: 400px;
  .form {
    margin-top: 30px;
    .submit-item {
      i {
        margin-right: 15px;
      }
    }
    .modify-pwd {
      width: 100%;
      height: 40px;
      border: 1px dashed #409eff;
      color: #409eff;
      background: none;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        border-style: solid;
        font-weight: 600;
      }
    }
  }
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 150px;
  height: 150px;
  box-sizing: border-box;
}
::v-deep .avatar-uploader .el-upload:hover {
  border: 2px dashed #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100%;
  height: 100%;
  line-height: 100%;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  font-size: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
