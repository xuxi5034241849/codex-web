<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :lg="16">
        <el-tabs v-model="settingTabs">
          <el-tab-pane label="个人信息" name="info">

            <el-form label-width="100px" :model="user" ref="user" :rules="rules" style="width: 400px">
              <el-form-item label="用户名:">
                {{user.userName}}
              </el-form-item>
              <el-form-item label="姓名:" prop="name">
                <el-input placeholder="请输入姓名" v-model="user.name"></el-input>
              </el-form-item>
              <el-form-item label="邮箱:" prop="email">
                <el-input placeholder="请输入邮箱" v-model="user.email"></el-input>
              </el-form-item>
              <el-form-item label="手机:" prop="telephone">
                <el-input placeholder="请输入手机" v-model="user.telephone"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitInfo" :loading="loading">保 存</el-button>
                <el-button>取 消</el-button>
              </el-form-item>
            </el-form>

          </el-tab-pane>
          <el-tab-pane label="安全配置" name="security">安全配置</el-tab-pane>
          <el-tab-pane label="其他" name="other">其他</el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>


<script>
  import { getInfo } from '@/api/user'

  export default {
    name: 'setting-index',
    data: function() {
      return {
        settingTabs: 'info',
        loading: false,
        user: {
          userName: null,
          password: null,
          name: null,
          email: null,
          telephone: null
        },
        rules: {
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
            {
              pattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
              message: '请输入正确的email'
            }
          ],
          telephone: [
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' },
            { pattern: /^1(\d{10})$/, message: '请输入正确的手机号码' }
          ]
        }
      }
    },
    created: function() {
      getInfo().then(response => {
        this.user = response.data
      })
    },
    methods: {
      submitInfo: function() {
        this.$refs.user.validate(valid => {
          if (valid) {
            this.loading = true
            this.$store.dispatch('RefreshUserInfo', this.user).then(() => {
              this.loading = false
              getInfo().then(response => {
                this.user = response.data
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
              })
            }).catch(() => {
              this.loading = false
            })
          }
        })
      }
    }
  }
</script>
