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
