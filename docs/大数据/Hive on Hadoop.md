# Hive on Hadoop

约定

1. 操作系统：Ubuntu 22.04.1
2. Linux用户名：hadoop:hadoop
3. 软件安装目录：/opt/bigdata

# 安装

安装并配置ssh服务

```bash
sudo apt install openssh-server
# 回车默认
ssh-keygen
ssh-copy-id hadoop@localhost
```

下载Java8

创建bigdata目录并下载解压jdk (从此绝对路径路径为 `cd /opt/bigdata`)

```bash
sudo mkdir /opt/bigdata & cd /opt/bigdata
sudo chown hadoop:hadoop /opt/bigdata
wget https://mirrors.tuna.tsinghua.edu.cn/Adoptium/8/jdk/x64/linux/OpenJDK8U-jdk_x64_linux_hotspot_8u372b07.tar.gz
tar -zxvf OpenJDK8U-jdk_x64_linux_hotspot_8u372b07.tar.gz
rm OpenJDK8U-jdk_x64_linux_hotspot_8u372b07.tar.gz
```

下载Hadoop并解压

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hadoop/common/hadoop-3.3.5/hadoop-3.3.5.tar.gz
tar -zxvf hadoop-3.3.5.tar.gz
rm hadoop-3.3.5.tar.gz
```

下载Hive并解压

```bash
wget https://mirrors.tuna.tsinghua.edu.cn/apache/hive/hive-3.1.3/apache-hive-3.1.3-bin.tar.gz
tar -zxvf apache-hive-3.1.3-bin.tar.gz
rm apache-hive-3.1.3-bin.tar.gz
```

安装MySQL数据库

建议选择第二种兼容模式连接数据库，不然老终端设备可能无法兼容

```bash
wget https://dev.mysql.com/get/mysql-apt-config_0.8.25-1_all.deb
sudo dpkg -i mysql-apt-config_0.8.25-1_all.deb
sudo apt update
sudo apt install mysql-server
```

# 配置

### 环境变量

在`sudo vim ~/.bashrc` 文件后添加

```bash
# JAVA
export JAVA_HOME=/opt/bigdata/jdk8u372-b07
export PATH=$PATH:$JAVA_HOME/bin

# HADAOOP
export HADOOP_HOME=/opt/bigdata/hadoop-3.3.5
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin

# HIVE
export HIVE_HOME=/opt/bigdata/apache-hive-3.1.3-bin
export PATH=$PATH:$HIVE_HOME/bin
```

```bash
source ~/.bashrc
```

### Hadoop

设置HADOOP配置文件

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

### Hive

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
```

初始化Hive元数据

```bash
schematool -initSchema -dbType mysql
```

# 启动

## Hadoop

- 启动`start-all.sh`
- 关闭`stop-all.sh`

### Hive

- 启动Hive `hive`
- 后台启动Hive元数据仓库
    - `nohup hive --service metastore > $HIVE_HOME/log/metastore.log 2>&1 &`
- 后台启动HiveServer2
    - `nohup hive --service hiveserver2 > $HIVE_HOME/log/hiveserver2.log 2>&1 &`
- beeline 链接 HiveServer2
    1. `beeline` 
    2. `!connect jdbc:hive2://localhost:10000`