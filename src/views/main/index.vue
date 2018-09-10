<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input placeholder="按表名搜索" style="width: 300px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="16">

        <!--列表 -->
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row
                  style="width: 100%;min-height:1000px;">
          <el-table-column label="序号" align="center" type="index" width="65"></el-table-column>
          <el-table-column label="表名" prop="tableName" align="center"></el-table-column>
          <el-table-column label="注释" prop="desc" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini">检查</el-button>
              <el-button type="success" size="mini" icon="el-icon-share">生成代码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>

      <!--数据源选择-->
      <el-col :xs="24" :sm="8">
        <el-card shadow="never" style="max-width: 400px;">
          <el-form ref="form" label-width="80px">
            <el-form-item label="数据源">
              <el-select v-model="currentDataSourceId" clearable placeholder="请选择数据源">
                <el-option
                v-for="item in dataSourceList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="danger" size="mini" @click="dataSourceDialogVisible = true">没有数据源点我创建数据源</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!--模板选择-->
        <el-card shadow="never" style="max-width: 400px; margin-top: 20px">
          <el-form ref="form" label-width="100px">
            <el-form-item label="模板">
              <el-select clearable v-model="currentTemplate.templateId" placeholder="请选择模板">
                <el-option
                v-for="item in templateList"
                :key="item.templateId"
                :label="item.templateName"
                :value="item.templateId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="success" size="mini" @click="templateDialogVisible = true">创建模板</el-button>
            </el-form-item>
            <hr>
            <el-form-item label="Entity：">
              <el-input v-model="currentTemplate.config.entity" placeholder="预设Entity类包路径"></el-input>
            </el-form-item>
            <el-form-item label="Mapper：">
              <el-input v-model="currentTemplate.config.mapper" placeholder="预设Mapper类包路径"></el-input>
            </el-form-item>
            <el-form-item label="Service：">
              <el-input v-model="currentTemplate.config.service" placeholder="预设Service类包路径"></el-input>
            </el-form-item>
            <el-form-item label="ServiceImpl：">
              <el-input v-model="currentTemplate.config.serviceImpl" placeholder="预设ServiceImpl类包路径"></el-input>
            </el-form-item>
            <el-form-item label="MapperXML：">
              <el-input v-model="currentTemplate.config.mapperXML" placeholder="预设MapperXML类包路径"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <!--添加数据源dialog-->
    <el-dialog title="创建数据源" width="500px" :visible.sync="dataSourceDialogVisible">
      <el-form label-width="80px" :model="newDataSource" ref="newDataSource" :rules="rules">
        <el-form-item label="连接名" prop="name">
          <el-input placeholder="连接名" v-model="newDataSource.name"></el-input>
        </el-form-item>
        <el-form-item label="连接URL" prop="url">
          <el-input placeholder="jdbc:mysql://localhost:3306/codex?useSSL=false" v-model="newDataSource.url"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input placeholder="root" v-model="newDataSource.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passwd">
          <el-input type="password" placeholder="passwd" v-model="newDataSource.passwd"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dataSourceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dataSourceSubmitForm('newDataSource')" :loading="loading">保 存</el-button>
      </div>
    </el-dialog>

    <!--添加模板dialog-->
    <el-dialog title="添加模板信息" width="700px" :visible.sync="templateDialogVisible">

      <el-form label-width="100px" :model="newTemplate" ref="newTemplate" :rules="rules">
        <el-form-item label="模板名称：" prop="templateName">
          <el-input v-model="newTemplate.templateName" placeholder="模板名称"></el-input>
        </el-form-item>
        <el-form-item label="Entity：" prop="entity">
          <el-input v-model="newTemplate.entity" placeholder="预设Entity类包路径：org.xuxi.codex.db.entity"></el-input>
        </el-form-item>
        <el-form-item label="Mapper：" prop="mapper">
          <el-input v-model="newTemplate.mapper" placeholder="预设Mapper类包路径：org.xuxi.codex.db.mapper"></el-input>
        </el-form-item>
        <el-form-item label="Service：" prop="service">
          <el-input v-model="newTemplate.service" placeholder="预设Service类包路径：org.xuxi.codex.db.service"></el-input>
        </el-form-item>
        <el-form-item label="ServiceImpl：" prop="serviceImpl">
          <el-input v-model="newTemplate.serviceImpl" placeholder="预设ServiceImpl类包路径：org.xuxi.codex.db.service.impl"></el-input>
        </el-form-item>
        <el-form-item label="MapperXML：" prop="mapperXML">
          <el-input v-model="newTemplate.mapperXML" placeholder="预设MapperXML类包路径：mapper"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="templateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="templateSubmitForm('newTemplate')" :loading="loading">保 存</el-button>
      </div>
    </el-dialog>

  </div>
</template>


<script>
  import { getDataSourceList, putDataSource } from '@/api/dataSource'
  import { getTemplateList, putTemplateConfig, getConfig } from '@/api/template'

  export default {
    name: 'tableGenerate',
    data() {
      return {
        currentDataSourceId: null,
        currentTemplate: {
          templateId: null,
          config: {
            entity: null,
            service: null,
            serviceImpl: null,
            mapper: null,
            mapperXML: null
          }
        },
        dataSourceDialogVisible: false,
        templateDialogVisible: false,
        listLoading: false,
        loading: false,
        dataSourceList: null,
        templateList: null,
        newDataSource: {
          name: null,
          url: null,
          username: null,
          passwd: null
        },
        newTemplate: {
          templateName: null,
          entity: null,
          mapper: null,
          service: null,
          serviceImpl: null,
          mapperXML: null
        },
        list: [{
          tableName: 'tb_user',
          desc: '用户表'
        }],
        rules: {
          name: [
            { required: true, message: '不输入名称，你后面怎么找到我？', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          url: [
            { required: true, message: '请数据数据源URL，不然我怎么帮你连接呢?', trigger: 'blur' },
            { max: 200, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ],
          username: [
            { required: true, message: '你不告诉我用户名，莫非是 "root" ?', trigger: 'blur' },
            { max: 50, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ],
          passwd: [
            { required: true, message: '你不告诉我密码，莫非是 "empty" ? 我保证不泄密.', trigger: 'blur' },
            { max: 50, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ], templateName: [
            { required: true, message: '不输入名称，你后面怎么找到我？', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
          ],
          entity: [
            { required: true, message: '我的小心心，你确定不给我你的爱？', trigger: 'blur' },
            { max: 200, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ],
          mapper: [
            { required: true, message: '我的小心心，你确定不给我你的爱？', trigger: 'blur' },
            { max: 200, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ],
          service: [
            { required: true, message: '我的小心心，你确定不给我你的爱？', trigger: 'blur' },
            { max: 200, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ],
          serviceImpl: [
            { required: true, message: '我的小心心，你确定不给我你的爱？', trigger: 'blur' },
            { max: 200, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ],
          mapperXML: [
            { required: true, message: '我的小心心，你确定不给我你的爱？', trigger: 'blur' },
            { max: 200, message: '不要太长了，我吞不下，老铁', trigger: 'blur' }
          ]
        }
      }
    },
    created: function() {
      // 获取datasource数据
      this.getDataSourceList()
      this.getTemplateList()
    },
    methods: {
      // 新数据源表单提交
      dataSourceSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            putDataSource(this.newDataSource).then(response => {
              this.dataSourceDialogVisible = false
              this.loading = false
            })
          }
        })
      }, // 新模板表单提交
      templateSubmitForm() {
        this.$refs['newTemplate'].validate((valid) => {
          if (valid) {
            putTemplateConfig(this.newTemplate).then(response => {
              this.templateDialogVisible = false
              this.loading = false
            })
          }
        })
      }, // 查询数据源
      getDataSourceList() {
        getDataSourceList().then(response => {
          this.dataSourceList = response.data
          if (this.dataSourceList && this.dataSourceList.length !== 0) {
            this.currentDataSourceId = this.dataSourceList[0].id
          }
        })
      },
      getTemplateList() {
        getTemplateList(1).then(response => {
          this.templateList = response.data
          if (this.templateList && this.templateList.length !== 0) {
            this.currentTemplate.templateId = this.templateList[0].templateId
            this.getTemplateConfig()
          }
        })
      },
      getTemplateConfig() {
        getConfig(this.currentTemplate.templateId).then(response => {
          this.currentTemplate.config = response.data
        })
      }
    }
  }

</script>

