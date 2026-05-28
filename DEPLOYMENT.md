# bbs-go 部署指南

本文档提供从零到上线的完整部署流程，目标是在新服务器上 **5 分钟内完成部署**。

---

## 目录

- [前置要求](#前置要求)
- [方式一：Docker Compose（推荐，最快）](#方式一docker-compose推荐最快)
- [方式二：使用预构建 Docker 镜像（无需源码）](#方式二使用预构建-docker-镜像无需源码)
- [方式三：手动部署（无 Docker）](#方式三手动部署无-docker)
- [Nginx 反向代理与 HTTPS](#nginx-反向代理与-https)
- [数据迁移](#数据迁移)
- [备份与恢复](#备份与恢复)
- [环境变量参考](#环境变量参考)
- [常见问题](#常见问题)

---

## 前置要求

| 依赖 | 最低版本 | 说明 |
|------|----------|------|
| Docker | 24.0+ | 需包含 Docker Compose v2 |
| Docker Compose | v2.20+ | 通常随 Docker 一起安装 |
| 内存 | 2GB+ | MySQL + Go API + Node SSR |
| 磁盘 | 10GB+ | 含数据库、上传文件、日志 |
| 端口 | 3000 | 默认 Web 访问端口 |

检查是否就绪：

```bash
docker --version          # Docker version 24.x+
docker compose version    # Docker Compose version v2.x+
docker info               # 确认 Docker daemon 正常运行
```

---

## 方式一：Docker Compose（推荐，最快）

这是最快的部署方式，**无需安装 Go、Node.js、MySQL**，所有依赖通过 Docker 容器提供。

### 1. 克隆项目

```bash
git clone https://github.com/mlogclub/bbs-go.git
cd bbs-go
```

### 2. 一键启动

```bash
docker compose up -d --build
```

首次构建约 3-5 分钟（需要下载基础镜像、编译前端和后端）。

### 3. 验证

```bash
docker compose ps          # 确认 bbs-go 和 mysql 都在运行
docker compose logs -f     # 查看实时日志
```

浏览器访问 `http://<服务器IP>:3000`，首次访问会自动进入安装向导。

### 4. 安装向导

访问 `http://<服务器IP>:3000/install` 完成初始化设置：
- 管理员账号
- 站点名称
- 数据库连接（Docker Compose 已自动配置，无需修改）

---

## 方式二：使用预构建 Docker 镜像（无需源码）

如果你不需要从源码构建，可以直接使用 Docker Hub 上的预构建镜像。

### 1. 创建部署目录

```bash
mkdir -p ~/bbs-go/data ~/bbs-go/logs ~/bbs-go/uploads
cd ~/bbs-go
```

### 2. 创建 docker-compose.yml

```yaml
services:
  mysql:
    image: mysql:8.4
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: bbsgo
      MYSQL_USER: bbsgo
      MYSQL_PASSWORD: bbsgo_password
      MYSQL_ROOT_PASSWORD: bbsgo_root_password
      TZ: Asia/Shanghai
    command:
      - --character-set-server=utf8mb4
      - --collation-server=utf8mb4_unicode_ci
    volumes:
      - mysql-data:/var/lib/mysql
    healthcheck:
      test: ["CMD-SHELL", "mysqladmin ping -h 127.0.0.1 -ubbsgo -pbbsgo_password --silent"]
      interval: 10s
      timeout: 5s
      retries: 10

  bbs-go:
    image: mlogclub/bbs-go:latest
    restart: unless-stopped
    depends_on:
      mysql:
        condition: service_healthy
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
      - ./uploads:/app/res/uploads
    ports:
      - "3000:3000"
    environment:
      BBSGO_ENV: prod
      NODE_ENV: production
      PORT: 3000
      BBSGO_SERVER_URL: http://127.0.0.1:8082
      BBSGO_INSTALL_DOCKER_BUILTIN_MYSQL: "true"
      BBSGO_DOCKER_BUILTIN_MYSQL_HOST: mysql
      BBSGO_DOCKER_BUILTIN_MYSQL_PORT: "3306"
      BBSGO_DOCKER_BUILTIN_MYSQL_DATABASE: bbsgo
      BBSGO_DOCKER_BUILTIN_MYSQL_USERNAME: bbsgo
      BBSGO_DOCKER_BUILTIN_MYSQL_PASSWORD: bbsgo_password
      TZ: Asia/Shanghai

volumes:
  mysql-data:
```

### 3. 启动

```bash
docker compose up -d
```

这种方式 **秒级启动**，无需编译构建。

---

## 方式三：手动部署（无 Docker）

适用于没有 Docker 环境或需要直接运行在本机的场景。

### 1. 安装依赖

```bash
# Go 1.26+
# Node.js 24+
# pnpm 10.30+
# MySQL 8.4+

# 以 Ubuntu/Debian 为例
sudo apt update
sudo apt install -y golang nodejs npm mysql-server

# 安装 pnpm
corepack enable
corepack prepare pnpm@10.30.2 --activate
```

### 2. 配置 MySQL

```bash
sudo mysql -u root
```

```sql
CREATE DATABASE bbsgo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'bbsgo'@'localhost' IDENTIFIED BY 'bbsgo_password';
GRANT ALL PRIVILEGES ON bbsgo.* TO 'bbsgo'@'localhost';
FLUSH PRIVILEGES;
```

### 3. 构建并运行

```bash
# 克隆并进入项目目录
git clone https://github.com/mlogclub/bbs-go.git
cd bbs-go

# 安装前端依赖并构建
make web-install
make web-build-spa

# 构建 Go 二进制
make build-go

# 复制配置文件
cp bbs-go.example.yaml bbs-go.yaml

# 编辑 bbs-go.yaml，配置数据库连接
# vim bbs-go.yaml
# 修改 db.url 为：
#   url: bbsgo:bbsgo_password@tcp(localhost:3306)/bbsgo?charset=utf8mb4&parseTime=True&multiStatements=true&loc=Local

# 启动
./bbs-go
```

### 4. 使用 PM2 进程管理（生产环境推荐）

```bash
npm install -g pm2
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

---

## Nginx 反向代理与 HTTPS

生产环境建议使用 Nginx 作为反向代理，并配置 SSL 证书。

### 1. 安装 Nginx

```bash
sudo apt install -y nginx
```

### 2. 配置 Nginx

创建 `/etc/nginx/sites-available/bbs-go`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 强制 HTTPS（配置 SSL 后取消注释）
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # WebSocket 支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }

    # 上传文件限制
    client_max_body_size 50M;
}
```

启用站点：

```bash
sudo ln -s /etc/nginx/sites-available/bbs-go /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. 配置 SSL（Let's Encrypt）

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 数据迁移

从旧服务器迁移到新服务器的完整流程。

### 1. 在新服务器部署空实例

先按 [方式一](#方式一docker-compose推荐最快) 完成基础部署并运行安装向导。

### 2. 导出旧服务器数据库

```bash
# 在旧服务器上执行
docker compose exec mysql mysqldump -ubbsgo -pbbsgo_password bbsgo > bbsgo_backup.sql
```

### 3. 传输到新服务器

```bash
scp bbsgo_backup.sql user@new-server:~/bbs-go/
```

### 4. 导入数据库

```bash
# 在新服务器上执行
docker compose exec -T mysql mysql -ubbsgo -pbbsgo_password bbsgo < bbsgo_backup.sql
```

### 5. 迁移上传文件

```bash
# 旧服务器打包
tar czf uploads.tar.gz -C docker-data/uploads .

# 传输到新服务器
scp uploads.tar.gz user@new-server:~/bbs-go/

# 新服务器解压
tar xzf uploads.tar.gz -C docker-data/uploads/
```

### 6. 迁移配置文件

```bash
# 旧服务器
scp docker-data/data/bbs-go.yaml user@new-server:~/bbs-go/docker-data/data/
```

### 7. 重启服务

```bash
docker compose restart bbs-go
```

---

## 备份与恢复

### 定时备份脚本

创建 `backup.sh`：

```bash
#!/bin/bash
BACKUP_DIR="/opt/bbs-go-backup"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p "$BACKUP_DIR"

# 备份数据库
docker compose exec -T mysql mysqldump -ubbsgo -pbbsgo_password bbsgo \
  | gzip > "$BACKUP_DIR/db_${DATE}.sql.gz"

# 备份上传文件
tar czf "$BACKUP_DIR/uploads_${DATE}.tar.gz" -C docker-data/uploads .

# 备份配置文件
cp docker-data/data/bbs-go.yaml "$BACKUP_DIR/config_${DATE}.yaml"

# 保留最近 7 天的备份
find "$BACKUP_DIR" -mtime +7 -delete

echo "Backup completed: $DATE"
```

设置 cron 定时任务（每天凌晨 3 点）：

```bash
chmod +x backup.sh
crontab -e
# 添加：0 3 * * * /path/to/backup.sh
```

### 恢复

```bash
# 恢复数据库
gunzip -c db_20260528_030000.sql.gz | docker compose exec -T mysql mysql -ubbsgo -pbbsgo_password bbsgo

# 恢复上传文件
tar xzf uploads_20260528_030000.tar.gz -C docker-data/uploads/

# 恢复配置
cp config_20260528_030000.yaml docker-data/data/bbs-go.yaml

docker compose restart bbs-go
```

---

## 环境变量参考

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `BBSGO_ENV` | `prod` | 应用运行环境 |
| `NODE_ENV` | `production` | Node.js 环境 |
| `PORT` | `3000` | SSR 服务器端口 |
| `BBSGO_SERVER_URL` | `http://127.0.0.1:8082` | SSR 代理到 Go API 的地址 |
| `BBSGO_INSTALL_DOCKER_BUILTIN_MYSQL` | `false` | 是否启用内置 MySQL 自动配置 |
| `BBSGO_DOCKER_BUILTIN_MYSQL_HOST` | `mysql` | MySQL 主机名 |
| `BBSGO_DOCKER_BUILTIN_MYSQL_PORT` | `3306` | MySQL 端口 |
| `BBSGO_DOCKER_BUILTIN_MYSQL_DATABASE` | `bbsgo` | 数据库名 |
| `BBSGO_DOCKER_BUILTIN_MYSQL_USERNAME` | `bbsgo` | 数据库用户名 |
| `BBSGO_DOCKER_BUILTIN_MYSQL_PASSWORD` | `bbsgo_password` | 数据库密码 |
| `BBSGO_DOCKER_MYSQL_ROOT_PASSWORD` | `bbsgo_root_password` | MySQL root 密码 |
| `TZ` | `Asia/Shanghai` | 时区 |

---

## 常见问题

### 构建很慢？

使用预构建镜像（[方式二](#方式二使用预构建-docker-镜像无需源码)）跳过编译，秒级启动。

### 端口 3000 被占用？

修改 `docker-compose.yml` 中的端口映射：

```yaml
ports:
  - "8080:3000"  # 将宿主机 8080 映射到容器 3000
```

### 如何更新到最新版本？

```bash
git pull
docker compose up -d --build
```

或使用预构建镜像：

```bash
docker compose pull
docker compose up -d
```

### 如何查看日志？

```bash
docker compose logs -f bbs-go    # 应用日志
docker compose logs -f mysql     # 数据库日志
```

### 如何进入容器调试？

```bash
docker compose exec bbs-go sh    # 进入应用容器
docker compose exec mysql sh     # 进入数据库容器
```

### 数据库连接失败？

检查 `docker compose logs bbs-go` 中的错误信息，确认：
- MySQL 服务已启动（`docker compose ps` 中 mysql 状态为 healthy）
- 数据库用户名/密码与环境变量一致
- 网络连通（`docker compose exec bbs-go wget -qO- http://mysql:3306`）

### 如何重置安装状态？

删除配置文件后重启容器即可重新进入安装向导：

```bash
rm docker-data/data/bbs-go.yaml
docker compose restart bbs-go
```

### arm64 服务器支持？

修改 `Dockerfile` 中的构建平台：

```dockerfile
# 取消注释 CI 中的 arm64 构建
# 或本地构建时指定：
docker buildx build --platform linux/arm64 -t bbs-go .
```
