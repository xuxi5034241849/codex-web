<template>
  <div>
    <el-menu class="navbar" mode="horizontal">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
      <breadcrumb></breadcrumb>
      <div class="right-menu"right-menu>
        <div class="welcome-title">欢迎大佬：{{name}}</div>
        <el-dropdown class="avatar-container" trigger="click">
          <div class="avatar-wrapper">
            <img class="user-avatar" src="/static/portrait/default.gif">
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <router-link class="inlineBlock" to="/setting">
              <el-dropdown-item>
                个人中心
              </el-dropdown-item>
            </router-link>
            <el-dropdown-item divided >
              <span @click="modifyPasswdVisible = true" style="display:block; text-align: center">
                修改密码
              </span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout" style="display:block; text-align: center">退  出</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-menu>
    <div>
      <!--修改密码dialog-->
      <el-dialog title="修改密码" width="400px" :visible.sync="modifyPasswdVisible">
        <el-form label-width="80px" :model="info" ref="info" :rules="rules">
          <el-form-item label="原密码:" prop="oldPasswd">
            <el-input type="password" placeholder="请输入原密码" v-model="info.oldPasswd"></el-input>
          </el-form-item>
          <el-form-item label="密码:" prop="passwd">
            <el-input type="password" placeholder="请输入新密码" v-model="info.passwd"></el-input>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="modifyPasswdVisible = false">取 消</el-button>
          <el-button type="primary" @click="modifyPasswd" :loading="loading">修 改</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { modifyPasswd } from '@/api/user'

export default {
  data() {
    return {
      info: {
        oldPasswd: null,
        passwd: null
      },
      modifyPasswdVisible: false,
      loading: false,
      rules: {
        passwd: [
          { required: true, message: '大佬，我这不支持SSH key 免密登陆.请给个密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        oldPasswd: [
          { required: true, message: '大佬，不给个原来的密码休想我帮你改密码.', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    },
    modifyPasswd() {
      this.$refs.info.validate(valid => {
        if (valid) {
          modifyPasswd(this.$store.getters.userId, this.info).then(response => {
            this.$refs.info.resetFields()
            this.modifyPasswdVisible = false
            this.info = {
              oldPasswd: null,
              passwd: null
            }
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  .right-menu {
    float: right;
    height: 100%;
    &:focus{
      outline: none;
    }
    .right-menu-item {
      display: inline-block;
      margin: 0 8px;
    }
    .screenfull {
      height: 20px;
    }
    .international{
      vertical-align: top;
    }
    .theme-switch {
      vertical-align: 15px;
    }
    .avatar-container {
      height: 50px;
      margin-right: 30px;
      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }
        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .welcome-title{
    position: absolute;
    right: 130px;    list-style: none;
    font-size: 14px;
    color: #606266;

  }
}
</style>

