# 第一阶段：构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 先拷贝包管理文件（利用Docker缓存层）
COPY package*.json ./
RUN npm ci --only=production

# 拷贝源代码
COPY . .

# 构建应用（根据实际框架调整）
RUN npm run build

# 第二阶段：生产环境
FROM nginx:1.25-alpine

# 删除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 拷贝自定义nginx配置
COPY nginx.conf /etc/nginx/conf.d/

# 从构建阶段拷贝编译结果
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动nginx并保持前台运行
CMD ["nginx", "-g", "daemon off;"]