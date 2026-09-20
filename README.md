# 卢恒 · 个人作品集

求职用的个人站点。前台是深色单页作品集，后台是一套可以改文案、作品、技能和联系方式的 CMS。

GitHub： [luheng11](https://github.com/luheng11)

## 能做什么

- 首页：开场、关于我、技能栈、项目、联系方式
- 独立页：文章、证书
- 后台登录后可改站点名称、首页全部文案、数据卡、技能分组、项目标题
- 作品 / 文章 / 证书 / 技能条目的增删改查、标签、封面图、富文本
- 响应式布局，适配桌面和手机

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | React 18、TypeScript、Vite 6、Tailwind CSS 3、React Router、Zustand |
| 后端 | Express、TypeScript、SQLite、Drizzle ORM、JWT |
| 编辑器 | Tiptap |

## 本地运行

需要 Node.js 20+。后端启动必须设置 `JWT_SECRET`，否则无法登录后台。

```bash
# 后端，端口 3001
cd api
npm install
# Windows PowerShell
$env:JWT_SECRET = "请改成自己的密钥"
npm run dev

# 前端，另开一个终端，默认端口 5173
npm install
npm run dev
```

也可以用仓库里的脚本：

```bash
# Windows
scripts\start.bat

# macOS / Linux
chmod +x scripts/*.sh
./scripts/start.sh
```

脚本不会自动写入 `JWT_SECRET`。用脚本启动时，请先在 `api` 目录准备好环境变量。

### 访问地址

| 页面 | 地址 |
| --- | --- |
| 作品集 | http://localhost:5173 |
| 管理后台 | http://localhost:5173/admin/login |
| API | http://localhost:3001 |

后台默认账号：`admin` / `admin123`。上线前必须改掉，见下方「Docker / 上线」。

Vite 开发代理会把 `/api` 和 `/uploads` 转到 `http://localhost:3001`。如果 5173 被占用，会自动改用 5174。

## 后台改文案

登录后打开 **网站设置**，可以改这些首页内容：

- 开场：问候语、名字、职位、一句话介绍、按钮文字、3D 星座节点
- 关于我：标题、两段介绍、状态行、四张数据卡
- 技能与项目：技能分组（每行 `分类: 技能1, 技能2`）、项目区标题
- 联系方式：标题和说明

项目、文章、证书的条目在 **内容管理** 里维护。

## 项目结构

```
├── api/                 后端
│   ├── src/controllers
│   ├── src/routes
│   ├── src/schemas      数据表
│   └── src/db           SQLite 与初始数据
├── src/                 前端
│   ├── admin/           后台页面
│   ├── components/      首页组件
│   ├── pages/           前台路由
│   └── context/         站点设置
├── uploads/             上传图片（不入库）
├── database.sqlite      SQLite 数据文件（不入库）
└── scripts/             本地启停脚本
```

数据库在项目根目录的 `database.sqlite`。表包括 `content`、`setting`、`tag`、`admin_user`。

空库时可以在 `api` 目录执行：

```bash
npx tsx src/db/seed.ts
```

它只会补缺失的设置项，不会覆盖你已经改过的内容。

## Docker / 上线

这个项目需要能写磁盘的服务器（SQLite + 图片上传），不适合只放到 EdgeOne / Vercel 静态托管。

### 准备

1. 一台装了 Docker 的云主机，域名 A 记录指到服务器 IP。
2. 克隆仓库后，复制环境变量并改掉默认值：

```bash
cp .env.example .env
```

`.env` 至少包含：

```
JWT_SECRET=足够长的随机串
ADMIN_USERNAME=admin
ADMIN_PASSWORD=你的新密码
```

不要把 `.env` 提交进 git。生产环境缺少 `JWT_SECRET` 或 `ADMIN_PASSWORD` 时 API 会拒绝启动。

空库第一次启动时，会按 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 创建管理员。如果 `database.sqlite` 里已经有账号，改 `.env` 不会自动改密码，需要进后台改，或删掉库文件后重建。

3. 先创建数据文件，避免 Docker 把 `database.sqlite` 挂成目录：

```bash
# Linux / macOS
mkdir -p uploads
touch database.sqlite

# Windows PowerShell
New-Item -ItemType Directory -Force uploads | Out-Null
if (-not (Test-Path database.sqlite)) { New-Item database.sqlite | Out-Null }
```

### 启动

```bash
docker compose up -d --build
```

| 服务 | 地址 |
| --- | --- |
| 前台 | http://服务器IP 或 http://你的域名 |
| 后台 | http://你的域名/admin/login |
| API | http://你的域名/api |

Nginx 已把 `/api` 和 `/uploads` 反代到后端。需要改域名时编辑 `nginx/nginx.conf` 里的 `server_name`，然后重启 frontend 容器。

### HTTPS

在宿主机用 Caddy 或 Nginx 把 443 反代到容器 80，并申请 Let’s Encrypt 证书。不要把证书配进业务容器里，宿主机反代更简单。

### 备份

定期拷走这两处，丢掉就等于丢掉后台改过的内容和图片：

- `database.sqlite`
- `uploads/`

### 更新

```bash
git pull
docker compose up -d --build
```

数据在挂载卷里，重建镜像不会清库。

## 构建

```bash
npm run build          # 前端 → dist/
cd api && npm run build
```
