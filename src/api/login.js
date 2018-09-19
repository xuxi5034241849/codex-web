import request from '@/utils/request'

// 登陆
export function login(userName, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

// 登出
export function logout() {
  return request({
    url: '/login/out',
    method: 'post'
  })
}

