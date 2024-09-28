---
title: '关于折腾服务器'
description: '关于折腾阿里云服务器的过程'
pubDate: 'Jul 31 2024'
---
## 白嫖

阿里学生认证可以白嫖300块钱额度

[阿里云 - 学生认证](
https://university.aliyun.com/mobile?spm=a2c6h.12873639.article-detail.6.45a42e34LIo0xA&clubTaskBiz=subTask..11405194..10212..&userCode=lwnkbv7n
)

 购买了一台最便宜的服务器 -285

[阿里云 - 弹性计算 (aliyun.com)](https://ecs-buy.aliyun.com/ecs/#/custom/prepay/cn-qingdao)

我使用 Debian 系统

## 防火墙相关

如果安装了防火墙，可能会出现 `workbench` 无法连接的情况，刨去安全组的同意以外，还需要 VNC 等内关闭防火墙，比如说

```bash
iptables  -I INPUT -p tcp  --dport 22  -j ACCEPT
```

等等

## ssh连接

### 确保 SSH 服务器在 Debian 上运行

首先，确保 Debian 服务器上安装并运行了 SSH 服务器。你可以通过以下命令检查和启动 SSH 服务：

```bash
sudo systemctl status ssh
sudo systemctl start ssh  # 如果SSH服务没有运行，启动它
```

### 获取服务器的 IP 地址

你需要知道你的 Debian 服务器的公共 IP 地址。你可以通过云服务提供商的控制面板或在服务器上运行以下命令来获取：

```bash
curl ifconfig.me
```

#### 关于没有公网ip只有私网ip的情况

因为没有选购带宽，带宽为0M。选购1M或者以上的带宽即可。

### ssh链接

#### Windows 系统下载 Git for Windows

- [Git for Windows](https://gitforwindows.org/)

- 安装

#### 使用 Git Bash 进行 SSH 连接：

- 安装完成后，打开 Git Bash。

- 在 Git Bash 中输入以下命令进行 SSH 连接：

  ```sh
  ssh root@12.345.456.789
  ```

  然后按照提示输入密码。

#### 使用 MobaXterm Personal 链接

- 下载之后一看就会，就不说了

## Nginx 反代

阿里云自带 `Nginx` ，开放在 80 端口。

以一个简单的例子为例

### 例子：

```bash
  mkdir ~/mytestapp
  cd ~/mytestapp
```

如果需要检查当前工作目录：

```bash
pwd
```

创建`index.js`文件：

  ```js
  const http = require('http');
  
  const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
  });
  
  server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/');
  });
  ```

运行应用：

  ```bash
  node index.js
  ```

### Nginx部分：

- 创建一个新的虚拟主机配置文件：

```bash
sudo nano /etc/nginx/sites-available/mytestapp
```

- 在文件中添加以下内容，将 `your_domain_or_ip` 替换为你的服务器 IP 地址或域名：

```nginx
server {
    listen 8080;
    server_name your_domain_or_ip;# 可以替换为你的服务器IP或域名

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

- 保存并退出（按 `Ctrl+O` 然后按 `Enter` 保存文件，按 `Ctrl+X` 退出编辑器）。

- 启用虚拟主机配置

创建指向新配置文件的符号链接：

```bash
sudo ln -s /etc/nginx/sites-available/mytestapp /etc/nginx/sites-enabled/
```

- 检查和重启 Nginx

检查 Nginx 配置是否正确：

```bash
sudo nginx -t
```

- 如果配置正确，重启 Nginx 服务以应用更改：

```bash
sudo systemctl restart nginx
```

- 检查防火墙设置

确保防火墙允许 HTTP 流量通过：

```bash
sudo ufw allow 8080
```

### 启动失败？是不是端口被占用了：

如果Nginx 报告类似于 `bind() to 0.0.0.0:8080 failed (98: Address already in use)`，这意味着端口 8080 已经被其他进程占用。

#### 查找占用端口 8080 的进程

- 首先，确认哪个进程占用了端口 8080：

```bash
sudo lsof -i :8080
```

- 或者使用 `netstat`：

```bash
sudo netstat -tuln | grep :8080
```

这些命令会列出正在使用端口 8080 的进程。根据输出，你可以找出是哪个进程占用了端口 8080。

- 停止占用端口的服务

如果你发现是另一个 web 服务器（如 Apache）占用了端口 8080，你可以选择停止它。以 Apache 为例，你可以使用以下命令停止 Apache 服务：

```bash
sudo systemctl stop apache2
```

#### 重新启动 Nginx

停止占用端口的服务后，重新启动 Nginx：

```bash
sudo systemctl restart nginx
```



### 检查服务端口

如果你不确定是哪个服务占用了端口 8080，可以通过以下命令查看所有监听端口：

```bash
sudo netstat -tuln
```

或者：

```bash
sudo ss -tuln
```

#### 禁用其他 Web 服务器

如果你确定不需要其他 Web 服务器，可以禁用它们以释放端口 8080。使用以下命令禁用 Apache：

```bash
sudo systemctl disable apache2
sudo systemctl stop apache2
```

#### 更换端口

```bash
sudo nano /etc/nginx/sites-available/mytestindex
```

比如说：在配置文件中，将 `listen 8080;` 改为 `listen 8090;`

如果有多个 `listen` 指令，请确保它们都被更新。

在 `nano` 编辑器中，按 `Ctrl + X` 退出，然后按 `Y` 保存更改。

- 检测语法错误

```bash
sudo nginx -t
```

- 重启 Nginx 服务

```bash
sudo systemctl restart nginx
```

- 使用 `curl` 或浏览器访问新的端口以确保 `nginx` 正常工作。例如：

```bash
curl http://localhost:8090
```

- 更新防火墙设置

如果你的防火墙（如 `ufw`）配置了端口 8080，记得添加允许访问新端口 8090 的规则：

```bash
sudo ufw allow 8090/tcp
```

### 还是不能用？

如果你的服务器在云服务提供商上（如 AWS、Azure、阿里云等），请检查你的安全组或网络规则是否开放允许从外部访问端口 8080。

### 成功了的样子：

假如你的 ip 是 `56.123.45.789`，开放端口是 `8080`，那么你可以通过手机或者浏览器访问 http://56.123.45.789:8080/ 来看到 Hello World。

### 一关掉终端就外部进入不了网页 使用 PM2

如果你关掉终端后出现“502 Bad Gateway”错误，可能是因为你的 Node.js 应用在终端关闭后停止运行。为了避免这种情况，你需要将你的 Node.js 应用作为后台服务运行:

这里以 `PM2` 为例

#### 安装 PM2：

```bash
sudo npm install -g pm2
```

#### 启动应用：

在你的应用目录下，使用 `pm2` 启动应用：

```bash
pm2 start app.js --name "mytestapp"
```

替换 `app.js` 为你的 Node.js 应用入口文件的名称。

#### 保存进程列表：

```bash
pm2 save
```

#### 配置开机自启（可选）：

```bash
pm2 startup
```

## Docker

### 安装：

阿里云的 docker 安装很特（ma）别（fan）：

打开实例 -> 定时与自动化任务 -> 安装/卸载扩展程序 -> 要安装的扩展程序:公共扩展程序 -> Docker

而命令行安装我尝试了好多都失败了...

### docker pull

有的冷门的阿里云自带的镜像 pull 不下来

需要民间镜像：比如说：[Docker Hub 镜像加速 (uuuadc.top)](https://hub.uuuadc.top/)
