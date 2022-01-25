<template>
  <div class="container">
    <el-upload
      class="avatar-uploader"
      action="/info/editFace"
      :multiple="false"
      :show-file-list="false"
      accept=".jpg,.jpeg,.png"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      class="form"
    >
      <el-form-item label="用户名">
        <el-input :value="ruleForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="confirmPwd">
        <el-select v-model="ruleForm.sex" placeholder="请选择">
          <el-option label="女" value="1"></el-option>
          <el-option label="男" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="电话号码" prop="mobile">
        <el-input
          type="number"
          v-model="ruleForm.mobile"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPwd">
        <el-input
          type="password"
          v-model="ruleForm.confirmPwd"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">修改</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { pwd, mobilePhone } from "util/regexp";
export default {
  created() {
    if (this.$store.state.userInfo.face) {
      this.imageUrl = this.$store.state.userInfo.face;
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
      ruleForm: {
        username: "",
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
            message: "用户名应为4-12位字符",
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
      const whiteList = [".jpg", ".jpeg", ".png"];

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
  },
};
</script>

<style lang="scss" scoped>
.container {
  margin-top: 40px;
  text-align: center;
  width: 400px;
}
::v-deep .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
::v-deep .avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 150px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 150px;
  display: block;
}
</style>
