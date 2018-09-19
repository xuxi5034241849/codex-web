<template>
  <div>
    <div class="login-container">
      <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
        <h3 class="title">Codex</h3>
        <el-form-item prop="username">
          <span class="svg-container svg-container_login">
            <svg-icon icon-class="user" />
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" />
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
          <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
            placeholder="password"></el-input>
            <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" :loading="loading" @click.native.prevent="handleLogin">
            登陆
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width:100%;" @click="registerVisible = true">
            注册
          </el-button>
        </el-form-item>
        <div class="tips">
          <span>「codex」一款解决团队开发效率的工具 </span>
        </div>
        <div class="tips">
          <span>xuxi5034241849@vip.qq.com</span>
        </div>
        <div class="tips">
          <span> @2018. 开源共享 </span>
        </div>
      </el-form>
    </div>
    <div>
      <!--注册账户dialog-->
      <el-dialog title="创建新的账户" width="600px" :visible.sync="registerVisible">
        <el-form label-width="80px" :model="user" ref="user" :rules="rules">
          <el-form-item label="用户名" prop="userName">
            <el-input placeholder="请输入用户名" v-model="user.userName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" placeholder="请输入密码" v-model="user.password"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input placeholder="请输入姓名" v-model="user.name"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input  placeholder="请输入邮箱" v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="telephone">
            <el-input  placeholder="请输入手机" v-model="user.telephone"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="registerVisible = false">取 消</el-button>
          <el-button type="primary" @click="register" :loading="loading">创 建 账 户</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { register, validUser } from '@/api/login'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }

    const validateUser = (rule, value, callback) => {
      validUser(value).then(response => {
        callback()
      }).catch(error => {
        console.log(error)
        callback(new Error(error.msg))
      })
    }

    return {
      user: {
        userName: null,
        password: null,
        name: null,
        email: null,
        telephone: null
      },
      rules: {
        userName: [
          { required: true, message: '大佬，给个用户名呗？', trigger: 'blur' },
          { min: 5, max: 20, message: '长度在 5 到 20 个字符', trigger: 'blur' },
          { pattern: /^[a-zA-Z]\w+/, message: '用户名为首字符必须为字母' },
          { validator: validateUser, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '大佬，我这不支持SSH key 免密登陆.请给个密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '大佬，留下你的名字？', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' },
          { pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/, message: '请输入正确的email' }
        ],
        telephone: [
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
          { pattern: /^1(\d{10})$/, message: '请输入正确的手机号码' }
        ]
      },
      registerVisible: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    register() {
      this.$refs.user.validate(valid => {
        if (valid) {
          register(this.user).then(response => {
            this.$refs.user.resetFields()
            this.registerVisible = false
            this.user = {
              userName: null,
              password: null,
              name: null,
              email: null,
              telephone: null
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#3c3c3c;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}

</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#585858;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-image: url("/static/login_bg.jpg");
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background-color: #fff9;
  }
  .tips {
    font-size: 14px;
    color: #585858;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
