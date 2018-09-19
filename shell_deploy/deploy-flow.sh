#! /bin/sh

# 调用方式
# ./deploy.sh <host> <dir> name

cd $WORKSPACE
source ~/.bash_profile

echo $PATH
node -v
npm -v

deploy_ssh_hosts=$1
deploy_dir=$2
deploy_name=$3
deploy_host_port=22


upload_path="$WORKSPACE/dist/dist.tar.gz"
deploy_path=$deploy_dir/$deploy_name


upgrade_app() {
    echo -e "发布app"

    echo -e "开始编译.....\n"

    build_app

    echo -e "编译完成\n"

    echo -e "循环启动app, 所有服务器: ${deploy_ssh_hosts}\n"

    startup_app ${deploy_ssh_hosts}

    echo "所有服务器启动app完成"

}

build_app() {
    npm install --registry=https://registry.npm.taobao.org
    npm run build:prod

    cd dist
    tar -zcvf dist.tar.gz *
}

startup_app() {

    echo -e "开始启动app......\n"

    # split host
    deploy_ssh_hosts_arr=(${1//,/ })

    for host in ${deploy_ssh_hosts_arr[*]}; do
        startup_host_app $host
    done

}

startup_host_app () {

    echo -e "当前主机: $1\n"

    deploy_ssh_host="$1"

    # 删除当前工程
    ssh $deploy_ssh_host "rm -rf $deploy_path"

    # 创建目录
    ssh $deploy_ssh_host "mkdir -p $deploy_path"

    echo "正在上传工程......"

    # 上传新的工程
    scp $upload_path $deploy_ssh_host:$deploy_path/

    echo "解压工程......"

    # 解压工程
    ssh $deploy_ssh_host "cd $deploy_path && tar -zxvf dist.tar.gz"

}

# 调用更新脚本
upgrade_app
