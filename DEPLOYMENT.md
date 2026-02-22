# 🚀 Инструкция по развертыванию портфолио

## Архитектура
- **Frontend:** Vercel (бесплатно)
- **Backend:** Timeweb VPS (~250₽/мес)
- **Database:** PostgreSQL на VPS
- **Files:** Локальное хранилище на VPS

---

## ЧАСТЬ 1: Развертывание Backend на Timeweb VPS

### Шаг 1: Заказ VPS

1. Перейдите на [timeweb.cloud](https://timeweb.cloud/ru/services/vds-vps)
2. Выберите конфигурацию:
   - **CPU:** 1 ядро
   - **RAM:** 2 ГБ
   - **SSD:** 10 ГБ
   - **OS:** Ubuntu 22.04 LTS
   - Цена: ~250₽/мес

3. Запомните:
   - IP адрес сервера
   - Пароль root (придет на email)

### Шаг 2: Подключение к серверу

```bash
ssh root@ВАШ_IP_АДРЕС
# Введите пароль
```

### Шаг 3: Установка необходимого ПО

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Установка PostgreSQL
apt install -y postgresql postgresql-contrib

# Установка Nginx
apt install -y nginx

# Установка PM2 (менеджер процессов)
npm install -g pm2
```

### Шаг 4: Настройка PostgreSQL

```bash
# Переключение на пользователя postgres
sudo -u postgres psql

# В консоли PostgreSQL выполните:
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'ВАША_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
\q
```

### Шаг 5: Клонирование проекта

```bash
# Установка Git (если нет)
apt install -y git

# Создание директории для проекта
mkdir -p /var/www
cd /var/www

# Клонирование репозитория
git clone https://github.com/ВАШ_USERNAME/portfolio.git
cd portfolio/backend

# Установка зависимостей
npm install
```

### Шаг 6: Настройка переменных окружения

```bash
# Создание .env файла
nano .env
```

Вставьте следующее (замените значения на свои):

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=portfolio_user
DB_PASSWORD=ВАША_SECURE_PASSWORD

# Server Configuration
PORT=3000
NODE_ENV=production

# CORS Configuration (URL вашего фронтенда на Vercel)
FRONTEND_URL=https://your-portfolio.vercel.app
BACKEND_URL=https://api.your-domain.ru

# Upload Configuration
UPLOAD_DIR=/var/www/portfolio/backend/uploads
MAX_FILE_SIZE=5242880
```

Сохраните: `Ctrl+O`, `Enter`, `Ctrl+X`

### Шаг 7: Создание директории для загрузок

```bash
mkdir -p /var/www/portfolio/backend/uploads
chmod 755 /var/www/portfolio/backend/uploads
```

### Шаг 8: Инициализация базы данных

```bash
# Запуск сервера для инициализации
node server.js

# В другом терминале (или через браузер):
curl -X POST http://localhost:3000/api/init

# Остановите сервер (Ctrl+C)
```

### Шаг 9: Запуск с помощью PM2

```bash
# Запуск приложения
pm2 start server.js --name portfolio-api

# Сохранение списка процессов
pm2 save

# Автозапуск при перезагрузке
pm2 startup
# Скопируйте и выполните команду, которую выведет PM2

# Проверка статуса
pm2 status
pm2 logs portfolio-api
```

### Шаг 10: Настройка Nginx

```bash
# Создание конфигурации Nginx
nano /etc/nginx/sites-available/portfolio
```

Вставьте следующее:

```nginx
server {
    listen 80;
    server_name ВАШ_IP_АДРЕС;  # или api.your-domain.ru если есть домен

    # Лимит размера загружаемых файлов
    client_max_body_size 10M;

    # Статические файлы (uploads)
    location /uploads/ {
        alias /var/www/portfolio/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # API endpoints
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Сохраните и активируйте конфигурацию:

```bash
# Создание симлинка
ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Удаление дефолтной конфигурации
rm /etc/nginx/sites-enabled/default

# Проверка конфигурации
nginx -t

# Перезапуск Nginx
systemctl restart nginx
```

### Шаг 11: (Опционально) Настройка SSL с Let's Encrypt

```bash
# Установка Certbot
apt install -y certbot python3-certbot-nginx

# Получение сертификата
certbot --nginx -d api.your-domain.ru

# Автообновление сертификата
certbot renew --dry-run
```

### Шаг 12: Проверка работы

```bash
# Проверка API
curl http://ВАШ_IP_АДРЕС/health

# Должен вернуть:
# {"status":"ok","timestamp":"..."}
```

---

## ЧАСТЬ 2: Развертывание Frontend на Vercel

### Шаг 1: Подготовка кода

1. Создайте `.env` файл в корне проекта:

```env
VITE_API_URL=http://ВАШ_IP_АДРЕС
# или если настроили домен и SSL:
# VITE_API_URL=https://api.your-domain.ru
```

2. Добавьте файлы в Git:

```bash
git add .
git commit -m "Prepared for deployment"
git push origin main
```

### Шаг 2: Регистрация на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "Sign Up" и войдите через GitHub
3. Дайте Vercel доступ к вашему репозиторию

### Шаг 3: Импорт проекта

1. На главной странице Vercel нажмите "Add New" → "Project"
2. Выберите ваш репозиторий `portfolio`
3. Настройки:
   - **Framework Preset:** Vite
   - **Root Directory:** `.` (оставьте пустым)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

### Шаг 4: Добавление переменных окружения

1. В разделе "Environment Variables" добавьте:
   - **Name:** `VITE_API_URL`
   - **Value:** `http://ВАШ_IP_АДРЕС` (или `https://api.your-domain.ru`)
   - Выберите все environments (Production, Preview, Development)

2. Нажмите "Add"

### Шаг 5: Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения сборки (~2-3 минуты)
3. Скопируйте URL вашего сайта (например: `https://portfolio-abc123.vercel.app`)

### Шаг 6: Обновление CORS на Backend

1. Подключитесь к VPS:

```bash
ssh root@ВАШ_IP_АДРЕС
cd /var/www/portfolio/backend
nano .env
```

2. Обновите `FRONTEND_URL`:

```env
FRONTEND_URL=https://portfolio-abc123.vercel.app
```

3. Перезапустите сервер:

```bash
pm2 restart portfolio-api
```

### Шаг 7: (Опционально) Custom Domain

1. В настройках проекта на Vercel перейдите в "Domains"
2. Добавьте ваш домен (например: `your-portfolio.ru`)
3. Настройте DNS согласно инструкциям Vercel
4. Обновите `FRONTEND_URL` в `.env` на backend

---

## ЧАСТЬ 3: Обновление проекта

### Обновление Frontend (автоматически)

```bash
# Локально
git add .
git commit -m "Update design"
git push origin main

# Vercel автоматически задеплоит изменения!
```

### Обновление Backend

```bash
# Подключитесь к VPS
ssh root@ВАШ_IP_АДРЕС
cd /var/www/portfolio/backend

# Получите последние изменения
git pull origin main

# Установите новые зависимости (если есть)
npm install

# Перезапустите сервер
pm2 restart portfolio-api
```

---

## Полезные команды

### PM2 (Backend Management)

```bash
# Статус
pm2 status

# Логи
pm2 logs portfolio-api

# Перезапуск
pm2 restart portfolio-api

# Остановка
pm2 stop portfolio-api

# Удаление из списка
pm2 delete portfolio-api
```

### PostgreSQL

```bash
# Подключение к БД
sudo -u postgres psql portfolio

# Просмотр таблиц
\dt

# Просмотр данных
SELECT * FROM projects;

# Выход
\q
```

### Nginx

```bash
# Проверка конфигурации
nginx -t

# Перезапуск
systemctl restart nginx

# Логи
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

---

## Troubleshooting

### Проблема: API не отвечает

```bash
# Проверьте статус PM2
pm2 status

# Проверьте логи
pm2 logs portfolio-api

# Проверьте порт
netstat -tulpn | grep 3000
```

### Проблема: CORS ошибки

1. Убедитесь, что `FRONTEND_URL` в `.env` совпадает с URL Vercel
2. Перезапустите backend: `pm2 restart portfolio-api`
3. Проверьте логи: `pm2 logs portfolio-api`

### Проблема: Изображения не загружаются

```bash
# Проверьте права доступа
ls -la /var/www/portfolio/backend/uploads

# Исправьте если нужно
chmod 755 /var/www/portfolio/backend/uploads
chown -R www-data:www-data /var/www/portfolio/backend/uploads
```

### Проблема: База данных не подключается

```bash
# Проверьте статус PostgreSQL
systemctl status postgresql

# Перезапустите
systemctl restart postgresql

# Проверьте пароль в .env
```

---

## Стоимость

### Минимальная конфигурация
- **Vercel:** 0₽ (Hobby Plan)
- **Timeweb VPS:** 250₽/мес
- **ИТОГО:** 250₽/мес (~3000₽/год)

### С доменом
- **Domain .ru:** ~300₽/год (Timeweb, Reg.ru)
- **ИТОГО:** ~3300₽/год

---

## Контакты поддержки

- **Timeweb:** [support.timeweb.ru](https://support.timeweb.ru)
- **Vercel:** [vercel.com/support](https://vercel.com/support)

---

🎉 **Готово!** Ваше портфолио теперь доступно из России без VPN!
