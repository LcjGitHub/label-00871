# Stage 1: Assembly (模拟编译/组装过程)
# 使用 Alpine 作为基础镜像，体积小且支持多架构
FROM alpine:latest AS builder

WORKDIR /app

# 复制源代码（从 frontend-admin 目录）
COPY frontend-admin/ .

# 在此处可以添加构建步骤，例如压缩图片、合并文件等
# 对于原生 JS 项目，我们主要做文件清理和筛选
# 创建 dist 目录用于生产环境
RUN mkdir -p dist && \
    cp index.html dist/ && \
    cp data.js dist/ && \
    cp -r src dist/src

# Stage 2: Production Server
# 使用 Nginx Alpine 版本，天然支持 ARM64 和 AMD64 (x86)
FROM nginx:alpine

# 移除默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 复制自定义 Nginx 配置
COPY frontend-admin/nginx.conf /etc/nginx/nginx.conf

# 从构建阶段复制处理好的文件到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 启动命令
CMD ["nginx", "-g", "daemon off;"]
