# 🔧 ИСПРАВЛЕНИЕ ОШИБКИ "Failed to fetch"

## ❌ Проблема
```
Error loading data: TypeError: Failed to fetch
```

## ✅ Решение (3 простых шага)

### ШАГ 1: Установите PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
Скачайте с https://www.postgresql.org/download/windows/

---

### ШАГ 2: Создайте базу данных

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Создайте базу данных
CREATE DATABASE portfolio;

# Выйдите
\q
```

---

### ШАГ 3: Запустите Backend и Frontend

**Терминал 1 - Backend:**
```bash
cd backend
npm install
node server.js
```

Должны увидеть:
```
🚀 Portfolio Backend Server
================================
✅ Server running on port 3000
✅ Connected to PostgreSQL database
✅ Database tables initialized
```

**Терминал 2 - Frontend:**
```bash
npm run dev
```

Откройте: http://localhost:5173

---

## 🎯 Быстрая проверка

### 1. Backend работает?
Откройте в браузере: http://localhost:3000/health

Должны увидеть:
```json
{"status":"ok","timestamp":"..."}
```

### 2. База данных работает?
```bash
curl http://localhost:3000/api/projects
```

Должны увидеть:
```json
{"success":true,"data":[]}
```

### 3. Загрузите демо-данные
```bash
curl -X POST http://localhost:3000/api/init
```

Или через админку: http://localhost:5173/admin → "Загрузить демо-данные"

---

## 🎉 Готово!

Теперь на http://localhost:5173 должны появиться проекты!

---

## 🆘 Если все еще не работает

### Проверьте файлы:

**/.env:**
```env
VITE_API_URL=http://localhost:3000
```

**/backend/.env:**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=postgres
DB_PASSWORD=postgres

PORT=3000
FRONTEND_URL=http://localhost:5173
UPLOAD_DIR=./uploads
```

### Проверьте логи:

Откройте DevTools (F12) → Console

Должны видеть:
```
🔄 Загрузка данных с API: http://localhost:3000/api/projects
✅ Projects loaded: ...
```

---

## 📞 Еще проблемы?

См. полную диагностику в файле [TEST_CONNECTION.md](./TEST_CONNECTION.md)
