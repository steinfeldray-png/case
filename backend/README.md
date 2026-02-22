# Portfolio Backend API

Express.js сервер для портфолио Alexander Petrov.

## 🚀 Быстрый запуск

### Вариант A: Simple Mode (БЕЗ PostgreSQL)

```bash
npm install
npm run simple
```

**Готово!** Сервер работает на http://localhost:3000

### Вариант B: Full Mode (С PostgreSQL)

```bash
npm install
npm start
```

Требует настройку PostgreSQL (см. ниже).

---

## 📊 Режимы работы

| Режим | Команда | PostgreSQL | Данные |
|-------|---------|------------|--------|
| **Simple** | `npm run simple` | ❌ Не нужен | В памяти (временно) |
| **Full** | `npm start` | ✅ Требуется | В PostgreSQL (постоянно) |

**Рекомендация:**  
- Для разработки: Simple Mode
- Для production: Full Mode

---

## 🛠️ Установка PostgreSQL

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### macOS
```bash
brew install postgresql@14
brew services start postgresql@14
```

### Создание базы данных

```bash
sudo -u postgres psql
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
\q
```

---

## ⚙️ Конфигурация

### 1. Скопируйте .env.example в .env

```bash
cp .env.example .env
nano .env
```

### 2. Настройте переменные

```env
# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=postgres
DB_PASSWORD=your_secure_password

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880
```

---

## 🎯 Доступные команды

```bash
npm run simple       # Запуск без PostgreSQL (рекомендуется)
npm run simple:dev   # С автоперезагрузкой
npm start            # Запуск с PostgreSQL
npm run dev          # С автоперезагрузкой и PostgreSQL
```

---

## 📡 API Endpoints

### Projects
- `GET /api/projects` - Получить все проекты
- `GET /api/projects/:slug` - Получить проект по slug
- `POST /api/projects` - Создать проект
- `PUT /api/projects/:id` - Обновить проект
- `DELETE /api/projects/:id` - Удалить проект

### Profile
- `GET /api/profile` - Получить профиль
- `PUT /api/profile` - Обновить профиль

### Upload
- `POST /api/upload` - Загрузить файл (multipart/form-data, поле: file)

### Utility
- `GET /health` - Health check
- `POST /api/init` - Инициализировать демо-данные (только Full Mode)

---

## 🔍 Тестирование API

```bash
# Health check
curl http://localhost:3000/health

# Получить проекты
curl http://localhost:3000/api/projects

# Получить профиль
curl http://localhost:3000/api/profile

# Инициализировать демо-данные (Full Mode)
curl -X POST http://localhost:3000/api/init
```

---

## 📁 Структура файлов

```
backend/
├── server.js           # Полный сервер с PostgreSQL
├── server-simple.js    # Упрощенный сервер (in-memory)
├── db.js               # PostgreSQL логика
├── package.json        # Зависимости
├── .env.example        # Пример конфигурации
└── uploads/            # Загруженные файлы
```

---

## 🌐 Деплой на production

См. `/DEPLOYMENT.md` в корне проекта для полных инструкций.

---

## 🆘 Troubleshooting

### PostgreSQL не подключается
```bash
# Проверьте статус
sudo systemctl status postgresql

# Перезапустите
sudo systemctl restart postgresql
```

### Порт 3000 занят
```bash
# Найдите процесс
lsof -i :3000

# Убейте процесс
kill -9 [PID]
```

### База данных не создается
```bash
# Попробуйте от пользователя postgres
sudo -u postgres createdb portfolio
```