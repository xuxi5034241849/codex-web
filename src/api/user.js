import request from '@/utils/request'

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/get-user',
    method: 'get',
    params: { token }
  })
}

// 获取用户信息
export function modifyUserInfo(userInfo) {
  return request({
    url: '/user/modify',
    method: 'post',
    data: {
      id: userInfo.userId,
      email: userInfo.email,
      telephone: userInfo.telephone,
      name: userInfo.name
    }
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
