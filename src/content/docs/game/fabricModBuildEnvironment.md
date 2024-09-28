---
title: 'Fabric MOD 环境配置'
description: '环境配置的要点'
---


# 环境配置
获取模板mod：[Template mod generator | Fabric (fabricmc.net)](https://fabricmc.net/develop/template/)


## 代理
如下在gradle.properties配置代理，然后idea导入项目，加载gradle
```.properties
# gradle配置代理
# gradle.properties

# http
systemProp.http.proxyHost=127.0.0.1
systemProp.http.proxyPort=4780

# https
systemProp.https.proxyHost=127.0.0.1
systemProp.https.proxyPort=4780
```

如果导入gradle提示java版本不对，在`idea设置/Build/ Build Tools/Gradle`里面改构建gradle使用的jdk版本。

## 镜像源
如有需要，可以在 `gradle.properties` 中设置镜像源。镜像源可能有时不可用，或者内容更新滞后，如需使用官方源，可暂时将相关内容注释掉即可。BMCLAPI 镜像缓慢时，可使用官方源，或参考校园网联合镜像站。

``` properties
loom_libraries_base=https://bmclapi2.bangbang93.com/maven/
loom_resources_base=https://bmclapi2.bangbang93.com/assets/
loom_version_manifests=https://bmclapi2.bangbang93.com/mc/game/version_manifest.json
loom_experimental_versions=https://maven.fabricmc.net/net/minecraft/experimental_versions.json
loom_fabric_repository=https://repository.hanbings.io/proxy/
```

## Gradle 无法下载
部分地区的用户在下载 Gradle 时，可能遇到 `Connection Reset` 的问题。这种情况下可以使用镜像源下载 Gradle。例如，在 `gradle/wrapper/gradle-wrapper.properties` 文件中，将 `distributionUrl` 的值设置为镜像地址，例如：

### 修改前
```
distributionUrl=https://services.gradle.org/distributions/gradle-8.7-bin.zip
```
### 修改后
```
distributionUrl=https://mirrors.cloud.tencent.com/gradle/gradle-8.7-bin.zip
```
注：Gradle 的镜像不止腾讯。