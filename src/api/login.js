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

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/get-user',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout() {
  return request({
    url: '/login/out',
    method: 'post'
  })
}

// 注册
export function register(user) {
  return request({
    url: '/register',
    method: 'post',
    data: user
  })
}

// 修改密码
export function modifyPasswd(userId, info) {
  console.log(userId)
  return request({
    url: '/passwd/modify',
    method: 'post',
    data: {
      id: userId,
      oldPassword: info.oldPasswd,
      password: info.passwd
    }
  })
}

// 检查用户是否重复
export function validUser(userName) {
  return request({
    url: `/valid/user/${userName}`,
    method: 'get'
  })
}
