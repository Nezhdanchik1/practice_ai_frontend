# Этап 1: Сборка приложения
FROM node:18 AS build

WORKDIR /app

# Копируем package.json и package-lock.json (или yarn.lock)
COPY package*.json ./
RUN npm install

# Копируем остальной проект + .env
COPY . .

# Собираем продакшн-версию (переменные из .env будут встроены)
RUN npm run build

# Этап 2: NGINX для сервировки
FROM nginx:stable-alpine

# Кастомная конфигурация (если используешь React Router и SPA)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Копируем готовую сборку из предыдущего этапа
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
