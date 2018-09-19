import request from '@/utils/request'

export function code(dataSourceId, tableName, templateId) {
  return request({
    url: `/generator/code/${dataSourceId}/${tableName}/${templateId}`,
    method: 'get'
  })
}
