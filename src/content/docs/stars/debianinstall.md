---
title: 'Debian的安装和配置'
description: '基于debian12'
pubDate: 'Jun 26 2024'
heroImage: '/debian12.png'
pinned: false
---
#### 总的来说具体的浏览器可以搜到，这里只说我自己安装的一些不同...
大体的我按照这个来安装的
[教程](https://blog.csdn.net/weixin_44200186/article/details/131970040)

##### 1 出现执行某个步骤失败，尝试重新运行这个项目 的问题
解决原理不明，总之我磁盘分区改为

- | Guided-use entire disk | 带引导模式方式直接使用整块磁盘 |

- 不使用镜像源

就解决了

##### 2 怎么让字符拼出debian的logo
```bash
$ sudo apt-get install screenfetch
$ screenfetch
```
假如出现了提权问题，即提示不是 `sudoers`文件等等

我是参照了这篇文章
https://www.mulingyuer.com/archives/940/

结果：
[结果图片](https://live.staticflickr.com/65535/53814829922_251592d412_b.jpg)

##### 3 ssh连接到虚拟机
###### 确保虚拟机已经启动并运行： 确保你的虚拟机已经启动并且处于运行状态。

###### 获取虚拟机的IP地址：可以在虚拟机的终端中运行以下命令来获取IP地址：

```bash
ip addr
```
- 在使用 ip addr 命令时，虚拟机会显示多个网络接口及其IP地址。 接口通常是以 eth0, ens33, enp0s3 等开头。
- 识别IPv4地址： 查找 inet 行对应的IP地址。IPv4地址通常在类似 inet 192.168.1.10/24 的格式中出现。IPv6地址通常以 inet6 开头，不适用于大多数常规的SSH连接。

示例输出：

```bash
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP qlen 1000
  link/ether 00:0c:29:5b:8f:9f brd ff:ff:ff:ff:ff:ff
  inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
  valid_lft forever preferred_lft forever
  inet6 fe80::20c:29ff:fe5b:8f9f/64 scope link
  valid_lft forever preferred_lft forever
```
在这个示例中，`192.168.1.10` 是你要使用的IP地址。

###### 设置VMware网络： 确保你的虚拟机网络设置允许从主机连接：

- 桥接模式（Bridged Networking）： 虚拟机和主机在同一网络中，可以直接访问虚拟机的IP地址。

- NAT模式（Network Address Translation）： 虚拟机通过主机的IP进行连接，需要设置端口转发。可以在VMware的虚拟机设置中配置端口转发。

###### 在主机上使用SSH连接虚拟机： 在主机系统的终端中，使用以下命令连接到虚拟机：

```bash
ssh username@ip_address
```
其中 username 是虚拟机上的用户名，ip_address 是虚拟机的IP地址。

##### 4.关于hyper-v
别用，只能说别用
整个手感跟远控差不多，有诡异的延迟

来都来了讲讲怎么开
如果电脑没有 Hyper-v
- 找个文档
```shell
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V-All /LimitAccess /ALL
```
- 改名成比如说 `Hyper.cmd` 然后运行，运行完了重启就有了。

###### 关于中文输入法
fctix5输入法，需要注意的是

pinyin在上面，键盘-汉语在下面

给下面那个要把键盘布局放在第一行忽悠了
