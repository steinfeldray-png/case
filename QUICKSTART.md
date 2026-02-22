# ⚡ Быстрый старт

## 🎯 Цель
Запустить портфолио локально за 5 минут.

## ✅ Шаг 1: Frontend

```bash
# Установить зависимости
npm install

# Создать .env
echo "VITE_API_URL=http://localhost:3000" > .env

# Запустить
npm run dev
```

**Откройте:** http://localhost:5173

---

## ✅ Шаг 2: Backend

**В новом терминале:**

```bash
cd backend

# Установить зависимости
npm install

# Создать .env
cp .env.example .env
nano .env
```

**Настройте .env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=postgres
DB_PASSWORD=your_password

PORT=3000
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```

**Запустить:**
```bash
node server.js
```

---

## ✅ Шаг 3: PostgreSQL

**Вариант A: Есть PostgreSQL**
```bash
sudo -u postgres psql
CREATE DATABASE portfolio;
\q
```

**Вариант B: Нет PostgreSQL**
```bash
# Ubuntu/Debian
sudo apt install postgresql

# macOS
brew install postgresql
brew services start postgresql
```

Затем создайте БД как в Варианте A.

---

## ✅ Шаг 4: Инициализация данных

**В браузере или curl:**
```bash
curl -X POST http://localhost:3000/api/init
```

**Или через админку:**
1. Откройте http://localhost:5173/admin
2. Нажмите "Загрузить демо-данные"

---

## 🎉 Готово!

- **Frontend:** http://localhost:5173
- **Admin:** http://localhost:5173/admin
- **API:** http://localhost:3000

---

## 🚀 Что дальше?

- См. [README.md](./README.md) для подробной информации
- См. [DEPLOYMENT.md](./DEPLOYMENT.md) для деплоя на VPS
