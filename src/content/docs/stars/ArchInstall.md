---
title: '安装 Arch Linux '
description: '使用VMware安装，版本号archlinux-2024.08.01-x86_64'
pubDate: 'Aug 28 2024'
---
> 本文发布于2024-8-28，请注意时效。

> 主体是[官网的教程](https://archlinuxstudio.github.io/ArchLinuxTutorial/#/rookie/basic_install)，但是融合了各种踩坑

## 先看看完成的样子：

<img src="https://vip.helloimg.com/i/2024/08/28/66cf37a403168.jpg"  alt="图像" class="responsive-image" />

## 先安装基础的无图形化界面
## 前期准备：
- 在[官网](https://archlinux.org/download/)下载好iso文件
- VMware创建虚拟机，选择iso文件，选择其它Linux里面最新的那个
- 选择配置，网络我选的是桥接模式
- 之后别着急启动，打开 `编辑虚拟机设置->选项->高级->固件类型->UEFI`

之后就可以启动了。
## 安装过程：
### 0.禁用 reflector
reflector 会为你选择速度合适的镜像源，但其结果并不准确，同时会清空配置文件中的内容，对于新人来讲并不适用，我们首先对其进行禁用。
```shell
systemctl stop reflector.service
```
 ### 1.再次确保是否为 UEFI 模式
在一系列的信息刷屏后，可以看到已经以 root 登陆安装系统了，此时可以执行的命令：
```shell
ls /sys/firmware/efi/efivars
```
若输出了一堆东西，即 efi 变量，则说明已在 UEFI 模式。否则请确认你的启动方式是否为 UEFI。

### 2.检测网络连接
因为是虚拟机，所以直接ping
```shell
ping www.baidu.com
```
### 3.更新系统时钟
```shell
timedatectl set-ntp true    #将系统时间与网络时间进行同步
timedatectl status          #检查服务状态
```
### 4.开始分区
#### 4.1.建立硬盘分区(这里使用cfdisk演示)
```shell
cfdisk
```
选择gpt

<img src="https://pica.zhimg.com/80/v2-902e7eb8544f74c1f9919365d1587508_720w.webp" alt="图像" class="responsive-image" />

之后可以参考[这个视频](https://www.bilibili.com/video/BV1J34y1f74E/)的前期部分的内容，进行分区

格式化和挂载分区也是参考上方视频。

在挂载时，挂载是有顺序的，先挂载根分区，再挂载 EFI 分区。 

### 5.添加镜像源
使用如下命令编辑镜像列表：
````shell
vim /etc/pacman.d/mirrorlist
````

其中的首行是将会使用的镜像源。添加中科大或者清华的放在最上面即可。
```shell
Server = https://mirrors.ustc.edu.cn/archlinux/$repo/os/$arch
Server = https://mirrors.tuna.tsinghua.edu.cn/archlinux/$repo/os/$arch

```
### 6.安装系统
#### 6.1.安装基础包
因为很重要所以着重提醒

VMware虚拟机不应该使用官网的
```shell
# VMware不要用这个
pacstrap /mnt base base-devel linux linux-headers linux-firmware 
```

而是使用
```shell
pacstrap /mnt base base-devel linux-lts btrfs-progs
```
- linux-lts：长期支持的内核软件包（LTS）。
#### 6.2.之后，安装其它必要的功能性软件：
```shell
pacstrap /mnt networkmanager vim sudo zsh zsh-completions
```
### 7.生成 fstab 文件
fstab 用来定义磁盘分区
````shell
genfstab -U /mnt >> /mnt/etc/fstab
````
复查一下 /mnt/etc/fstab 确保没有错误
```shell
cat /mnt/etc/fstab
```
### 8.change root
把环境切换到新系统的/mnt 下
```shell
arch-chroot /mnt
```
### 9.时区设置
设置时区，在`/etc/localtime` 下用/usr 中合适的时区创建符号连接。如下设置上海时区。
```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```
随后进行硬件时间设置，将当前的正确 UTC 时间写入硬件时间。
```shell
hwclock --systohc
```
### 10.本地化
设置 Locale 进行本地化
Locale 决定了地域、货币、时区日期的格式、字符排列方式和其他本地化标准。

首先使用 vim 编辑 /etc/locale.gen，去掉 en_US.UTF-8 所在行以及 zh_CN.UTF-8 所在行的注释符号（#）。
```shell
vim /etc/locale.gen
```

然后使用如下命令生成 locale。
```shell
locale-gen
```

最后向 `/etc/locale.conf` 导入内容
```shell
echo 'LANG=en_US.UTF-8'  > /etc/locale.conf
```
注意，这里是英文本地化

不推荐在此设置任何中文 locale，会导致 tty 乱码。
### 11.设置主机名
首先在/etc/hostname设置主机名
```shell
vim /etc/hostname
```

加入你想为主机取的主机名，这里比如叫 myarch。

接下来在`/etc/hosts`设置与其匹配的条目。
```shell
vim /etc/hosts
```

加入如下内容
```shell
127.0.0.1   localhost
::1         localhost
127.0.1.1   myarch
```

### 12.为 root 用户设置密码
```shell
passwd root
```
打密码显示不出来是正常的
### 13.安装微码
```shell
pacman -S intel-ucode   #Intel
pacman -S amd-ucode     #AMD
#根据自己二选一
```
### 14.安装引导程序

安装必要的包：

```bash

pacman -S grub efibootmgr os-prober
```
安装 GRUB 到 EFI 分区：

```bash
grub-install --target=x86_64-efi --efi-directory=/boot --bootloader-id=ARCH
```
编辑 `/etc/default/grub` 文件：

```bash
vim /etc/default/grub
```
进行如下修改：

- 去掉 `GRUB_CMDLINE_LINUX_DEFAULT` 中的 `quiet` 参数。
- 将 `loglevel` 设置为 `5`。
- 添加 `nowatchdog` 参数。 （即，把 quiet 换成 nowatchdog）
- 添加 `GRUB_DISABLE_OS_PROBER=false`。
- 
生成 GRUB 配置文件：

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```
### 15.完成安装
退出 chroot 环境：

```bash
exit
```
卸载新分区：

```bash
umount -R /mnt
```
重启系统：

```bash
reboot
```
确保在重启前拔掉安装介质，以避免再次进入安装程序。

## 安装完成以后
### 网络配置：
哪怕是虚拟机这时候也需要配置网络了

启动并启用 NetworkManager：
```bash
systemctl enable --now NetworkManager
```
测试网络连接：
```bash
ping www.bilibili.com
```
### 安装neofetch
```shell
pacman -S neofetch
```
查看：
```shell
neofetch
```
### 系统关机：

```bash
shutdown -h now
```
或

```bash
poweroff
```
## 安装 KDE 桌面
我使用的体验： KDE 薄纱 xfce

### 1.新建用户
首先，确保已经登录到一个已经具有管理员权限的账户。然后，可以使用以下命令新建一个用户：

```bash
sudo useradd -m -G wheel -s /bin/bash 新用户名
```
其中：

-m 表示创建用户的同时创建用户的主目录。
-G wheel 将用户添加到 wheel 组，这个组通常用于授权用户使用 sudo。
-s /bin/bash 设置用户的默认 shell 为 Bash。
为新用户设置密码：

```bash
sudo passwd 新用户名
```
### 2. 更新系统
   在安装 KDE Plasma 之前，确保你的系统是最新的：

```bash
sudo pacman -Syu
```
### 3. 安装 Xorg
   KDE Plasma 需要 Xorg 显示服务器，所以你需要先安装它：

```bash
sudo pacman -S xorg-server xorg-apps xorg-xinit
```
### 4. 安装 KDE Plasma 和基本套件
   接下来，安装 KDE Plasma 桌面环境和一些常用的应用程序：

```bash
sudo pacman -S plasma kde-applications
```
### 5. 启动并启用 SDDM
   KDE 使用 SDDM 作为显示管理器，需要启动并设置 SDDM 开机自动启动：

```bash 
sudo systemctl enable sddm.service
sudo systemctl start sddm.service
```
假如你之前使用过 Xfce，那么需要禁用它：
```shell
sudo systemctl disable lightdm.service
```
### 6.重启系统
完成以上步骤后，重启系统，验证 KDE Plasma 是否成功启动：

```bash
sudo reboot
```

## 踩的坑
### 关于输入法
假如你的界面是 Wayland

那么你需要在`设置->键盘->虚拟键盘`选择fcitx5的Wayland的专用键盘，不然切换不了输入法
<img src="https://img.picui.cn/free/2024/08/28/66cf351e66d56.jpg" alt="图像" class="responsive-image" />

### 关于驱动

不要安装nvidia闭源驱动545以上版本！

会crash内核！