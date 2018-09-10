import request from '@/utils/request'

export function putTemplateConfig(config) {
  return request({
    url: '/template/config-put',
    method: 'post',
    data: config
  })
}

export function getConfig(templateId) {
  return request({
    url: '/template/get-config',
    method: 'post',
    data: {
      templateId
    }
  })
}

export function getTemplateList(type) {
  return request({
    url: '/template/list',
    method: 'post',
    data: {
      type
    }
  })
}
