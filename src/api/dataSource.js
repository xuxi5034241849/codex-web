import request from '@/utils/request'

export function putDataSource(dataSource) {
  return request({
    url: '/datasource/put',
    method: 'post',
    data: dataSource
  })
}

export function getDataSourceList() {
  return request({
    url: '/datasource/list',
    method: 'post'
  })
}

export function getTableList(id) {
  return request({
    url: '/datasource/get-table-list',
    method: 'post',
    data: {
      id
    }
  })
}
