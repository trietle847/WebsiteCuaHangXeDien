FROM node:20-alpine AS build-stage

WORKDIR /app

# Cài dependencies trước để cache tốt hơn
COPY package.json package-lock.json ./
RUN npm install

# Mount code từ host vào container
COPY . .
# (sẽ cấu hình trong docker-compose.yml)

EXPOSE 3001

# Giai đoạn 2: Phục vụ ứng dụng bằng Nginx
# FROM nginx:alpine
# COPY --from=build-stage /app/dist /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]
CMD [ "npm","run","dev" ]