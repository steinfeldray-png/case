#!/bin/bash

echo "🚀 Запуск Portfolio"
echo "===================="
echo ""

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Проверка PostgreSQL
echo -e "${YELLOW}Проверка PostgreSQL...${NC}"
if ! command -v psql &> /dev/null; then
    echo -e "${RED}❌ PostgreSQL не установлен!${NC}"
    echo "Установите: sudo apt install postgresql (Ubuntu) или brew install postgresql (macOS)"
    exit 1
fi

# Проверка базы данных
echo -e "${YELLOW}Проверка базы данных 'portfolio'...${NC}"
if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw portfolio; then
    echo -e "${YELLOW}База данных не найдена. Создаю...${NC}"
    sudo -u postgres psql -c "CREATE DATABASE portfolio;"
    echo -e "${GREEN}✅ База данных создана${NC}"
else
    echo -e "${GREEN}✅ База данных существует${NC}"
fi

# Проверка .env файлов
echo ""
echo -e "${YELLOW}Проверка конфигурации...${NC}"

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}Создаю .env для frontend...${NC}"
    echo "VITE_API_URL=http://localhost:3000" > .env
    echo -e "${GREEN}✅ Frontend .env создан${NC}"
fi

if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}Создаю .env для backend...${NC}"
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✅ Backend .env создан${NC}"
    echo -e "${YELLOW}⚠️  Проверьте пароль PostgreSQL в backend/.env${NC}"
fi

# Установка зависимостей
echo ""
echo -e "${YELLOW}Установка зависимостей...${NC}"

if [ ! -d "node_modules" ]; then
    echo "Установка frontend зависимостей..."
    npm install
fi

if [ ! -d "backend/node_modules" ]; then
    echo "Установка backend зависимостей..."
    cd backend && npm install && cd ..
fi

echo -e "${GREEN}✅ Зависимости установлены${NC}"

# Запуск серверов
echo ""
echo -e "${GREEN}🚀 Запуск серверов...${NC}"
echo ""
echo "================================"
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:5173"
echo "Admin: http://localhost:5173/admin"
echo "================================"
echo ""
echo -e "${YELLOW}Для остановки нажмите Ctrl+C${NC}"
echo ""

# Запуск в фоне
cd backend && node server.js &
BACKEND_PID=$!

# Ждем запуска backend
sleep 2

# Запуск frontend
npm run dev &
FRONTEND_PID=$!

# Ждем завершения
wait $BACKEND_PID $FRONTEND_PID
