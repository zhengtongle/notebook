# 大数据（LoongArch64）

# 开发环境

## 用户权限

### 创建目录并设置权限

```bash
# 创建用户
useradd hadoop
# 修改用户的密码
passwd hadoop
# 设置sudoers
visudo
```

找到 `root    ALL=(ALL)       ALL` 按`yy`复制一行按`p`粘贴按`cw`修改root为用户名

```bash
## Allow root to run any commands anywhere
root    ALL=(ALL)       ALL

hadoop  ALL=(ALL)       ALL
## Allows members of the 'sys' group to run networking, software,
## service management apps and more.
# %sys ALL = NETWORKING, SOFTWARE, SERVICES, STORAGE, DELEGATING, PROCESSES, LOCATE, DRIVERS

## Allows people in group wheel to run all commands
%wheel  ALL=(ALL)       ALL
```

创建文件夹并设置权限

```bash
# 创建文件夹
mkdir -p /opt/bigdata/sofrware
# 设置权限
chown hadoop:hadoop -R /opt/bigdata
su hadoop
```

此后目录默认在 `/opt/bigdata`

## 安装Java

从[http://www.loongnix.cn/zh/api/java/](http://www.loongnix.cn/zh/api/java/)下载最新版本java8

```bash
cd software
# 下载
wget http://ftp.loongnix.cn/Java/openjdk8/loongson8.1.14-fx-jdk8u372b07-linux-loongarch64.tar.gz
# 解压
tar -zxvf loongson8.1.14-fx-jdk8u372b07-linux-loongarch64.tar.gz
# 删除压缩包
rm -rf loongson8.1.14-fx-jdk8u372b07-linux-loongarch64.tar.gz
```

编辑 `~/.bashrc` 添加以下内容

```bash
# JAVA
export JAVA_HOME=/opt/bigdata/software/jdk8u372-b07
export PATH=$PATH:$JAVA_HOME/bin
```

## Hadoop

### 获取安装

```bash
# 下载
cd /opt/bigdata/software/
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/stable/hadoop-3.3.5.tar.gz
# 解压
tar -zxvf hadoop-3.3.5.tar.gz
# 删除压缩包
rm -rf hadoop-3.3.5.tar.gz
```

编辑 `~/.bashrc` 添加以下内容

```bash
# Hadoop
export HADOOP_HOME=/opt/bigdata/software/hadoop-3.3.5
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

```

### 环境变量

编辑 `~/.bashrc` 添加以下内容

```bash

```

### 配置文件

core-site.xml `vim /opt/bigdata/hadoop-3.3.5/etc/hadoop/core-site.xml` 

```xml
<configuration>
    <property>
        <name>hadoop.tmp.dir</name>
        <value>file:/opt/bigdata/hadoop/tmp</value>
        <description>Abase for other temporary directories.</description>
    </property>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
    </property>
    <property>
        <name>hadoop.proxyuser.hadoop.hosts</name>
        <value>*</value>
    </property>
    <property>
        <name>hadoop.proxyuser.hadoop.groups</name>
        <value>*</value>
    </property>
</configuration>
```

hdfs-site.xml `vim /opt/bigdata/hadoop-3.3.5/etc/hadoop/hdfs-site.xml`

```xml
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>1</value>
  </property>
  <property>
    <name>dfs.namenode.name.dir</name>
    <value>file:/opt/bigdata/hadoop/tmp/dfs/name</value>
  </property>
  <property>
    <name>dfs.datanode.data.dir</name>
    <value>file:/opt/bigdata/hadoop/tmp/dfs/data</value>
  </property>
</configuration>
```

在 `vim /opt/bigdata/etc/hadoop/hadoop-env.sh` 中添加

```bash
# JAVA
export JAVA_HOME=/opt/bigdata/jdk8u372-b07
```

格式化NameNode

```bash
hdfs namenode -format
```

### 启停

- 启动`start-all.sh`
- 关闭`stop-all.sh`

## MySQL

```bash
# 安装MySQL
sudo yum install mysql-server
# 启动服务
sudo systemctl start mysqld
# 链接MySQL
sudo mysql
# 设置密码
ALTER USER 'root'@'localhost' IDENTIFIED BY '**PASSWORD**'; # 设置密码
```

## Hive

### 获取安装

```bash
# 下载
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz
# 解压
tar -zxvf apache-hive-3.1.3-bin.tar.gz
# 删除安装包
rm -rf apache-hive-3.1.3-bin.tar.gz
```

### 环境变量

编辑 `~/.bashrc` 添加以下内容

```bash
# HIVE
export HIVE_HOME=/opt/bigdata/software/apache-hive-3.1.3-bin
export PATH=$PATH:$HIVE_HOME/bin
```

### 配置文件

复制文件 `cp apache-hive-3.1.3-bin/conf/hive-default.xml.template apache-hive-3.1.3-bin/conf/hive-default.xml`

新建文件 `vim apache-hive-3.1.3-bin/conf/hive-site.xml` 并添加内容

```xml
<?xml version="1.0"?>
<?xml-stylesheet type="text/xsl" href="configuration.xsl"?>
<configuration>
        <property>
                <name>javax.jdo.option.ConnectionURL</name>
                <value>jdbc:mysql://localhost:3306/hive?createDatabaseIfNotExist=true</value>
        </property>
        <property>
                <name>javax.jdo.option.ConnectionDriverName</name>
                <value>com.mysql.cj.jdbc.Driver</value>
        </property>
        <property>
                <name>javax.jdo.option.ConnectionUserName</name>
                <value>root</value>
        </property>
        <property>
                <name>javax.jdo.option.ConnectionPassword</name>
                <value>password</value>
								<!-- MySQL数据库密码 -->
        </property>
</configuration>
```

下载MySQL Connector/J并添加到hive的依赖

```bash
wget https://downloads.mysql.com/archives/get/p/3/file/mysql-connector-j-8.0.32.tar.gz
tar -zxvf mysql-connector-j-8.0.32.tar.gz
cp mysql-connector-j-8.0.32/mysql-connector-j-8.0.32.jar apache-hive-3.1.3-bin/lib
mkdir /apache-hive-3.1.3-bin/log
rm -rf mysql*
```

初始化Hive元数据

```bash
schematool -initSchema -dbType mysql
```

### 启动

- 启动Hive `hive`
- 后台启动Hive元数据仓库
    - `nohup hive --service metastore > $HIVE_HOME/log/metastore.log 2>&1 &`
- 后台启动HiveServer2
    - `nohup hive --service hiveserver2 > $HIVE_HOME/log/hiveserver2.log 2>&1 &`
- beeline 链接 HiveServer2
    1. `beeline` 
    2. `!connect jdbc:hive2://localhost:10000`