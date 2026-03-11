import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: проверка admin-ключа для мутирующих запросов
const requireAdminKey = (req, res, next) => {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return next(); // Ключ не настроен — открытый доступ (dev)
  const provided = req.headers['x-admin-key'];
  if (provided !== adminKey) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
};

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));

// In-memory storage (вместо PostgreSQL)
let projects = [
  {
    id: 1,
    slug: "komus",
    title: "Комус",
    product: "E-commerce",
    platform: "Web, Mobile",
    description: "Редизайн платформы для офисных товаров с фокусом на B2B сегмент",
    year: "2024",
    challenge: "Устаревший интерфейс B2B платформы приводил к низкой конверсии и сложностям в оформлении крупных заказов. Корпоративные клиенты испытывали трудности с навигацией в каталоге из 50 000+ товаров.",
    solution: "Разработали новую систему навигации с расширенными фильтрами и bulk-заказами. Внедрили персонализацию на основе истории закупок. Создали упрощённый процесс оформления корпоративных заказов с поддержкой множественных способов оплаты и доставки.",
    results: [
      "Увеличение конверсии на 34%",
      "Сокращение времени оформления заказа на 45%",
      "Рост повторных покупок на 28%",
      "NPS вырос с 42 до 67"
    ],
    tags: ["E-commerce", "B2B", "Design System", "UX Research"],
    imageUrl: null,
    caseImages: []
  },
  {
    id: 2,
    slug: "crypto-wallet",
    title: "Crypto Wallet",
    product: "Финтех",
    platform: "Web, Mobile",
    description: "Разработка интерфейса криптовалютного кошелька",
    year: "2023",
    challenge: "Создать интуитивный интерфейс криптокошелька для новичков, сохранив при этом продвинутый функционал для опытных пользователей. Главная проблема — баланс между простотой и безопасностью.",
    solution: "Разработали двухуровневый интерфейс с упрощённым и расширенным режимами. Внедрили понятную визуализацию транзакций и портфеля. Создали обучающие подсказки для критичных операций. Разработали систему подтверждения транзакций с понятными предупреждениями.",
    results: [
      "95% успешность первых транзакций",
      "Снижение обращений в поддержку на 60%",
      "4.8 звёзд в App Store",
      "200K+ активных пользователей"
    ],
    tags: ["Fintech", "Mobile First", "Security UX", "Onboarding"],
    imageUrl: null,
    caseImages: []
  },
  {
    id: 3,
    slug: "business-automation",
    title: "Business Automation",
    product: "SaaS",
    platform: "Web",
    description: "Система автоматизации бизнес-процессов для малого бизнеса",
    year: "2024",
    challenge: "Малый бизнес нуждался в доступной системе автоматизации без необходимости технических знаний. Существующие решения были либо слишком сложными, либо ограниченными по функционалу.",
    solution: "Создали no-code конструктор бизнес-процессов с drag-and-drop интерфейсом. Разработали библиотеку готовых шаблонов для типовых задач. Внедрили визуальную аналитику с ключевыми метриками бизнеса. Добавили интеграции с популярными сервисами.",
    results: [
      "Экономия времени пользователей — 15 часов/неделю",
      "87% создают первую автоматизацию за 10 минут",
      "Retention rate 82% через месяц",
      "Средний чек увеличился на 45%"
    ],
    tags: ["SaaS", "No-code", "Business Tools", "Dashboard Design"],
    imageUrl: null,
    caseImages: []
  },
  {
    id: 4,
    slug: "marketplace",
    title: "Marketplace",
    product: "E-commerce",
    platform: "Web, Mobile",
    description: "Маркетплейс для продажи товаров ручной работы",
    year: "2023",
    challenge: "Создать платформу, которая помогает мастерам продавать свои изделия, конкурируя с крупными маркетплейсами. Нужно было выделить уникальность товаров и историю создателей.",
    solution: "Разработали интерфейс с акцентом на визуальную презентацию товаров и историю мастеров. Создали персонализированную ленту на основе предпочтений. Внедрили прямую коммуникацию покупателя с продавцом. Добавили social proof элементы и отзывы с фото.",
    results: [
      "15K продавцов за первые 6 месяцев",
      "Средний чек $85",
      "68% покупателей делают повторные покупки",
      "4.6 звёзд в отзывах покупателей"
    ],
    tags: ["Marketplace", "Social Commerce", "Mobile App", "Visual Design"],
    imageUrl: null,
    caseImages: []
  }
];

let profile = {
  photoUrl: null,
  name: "Alexander Petrov",
  about: null,
  telegramUrl: "https://t.me/saneuuu",
  cvUrl: null
};

// Create uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5242880 }
});

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/projects', (req, res) => {
  res.json({ success: true, data: projects });
});

app.get('/api/projects/:slug', (req, res) => {
  const project = projects.find(p => p.slug === req.params.slug);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

app.post('/api/projects', requireAdminKey, (req, res) => {
  const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
  const newProject = { id: newId, ...req.body };
  projects.push(newProject);
  res.json({ success: true, data: newProject });
});

app.put('/api/projects/:id', requireAdminKey, (req, res) => {
  const id = parseInt(req.params.id);
  const index = projects.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  
  projects[index] = { ...projects[index], ...req.body, id };
  res.json({ success: true, data: projects[index] });
});

app.delete('/api/projects/:id', requireAdminKey, (req, res) => {
  const id = parseInt(req.params.id);
  projects = projects.filter(p => p.id !== id);
  res.json({ success: true });
});

app.get('/api/profile', (req, res) => {
  res.json({ success: true, data: profile });
});

app.put('/api/profile', requireAdminKey, (req, res) => {
  profile = { ...profile, ...req.body };
  res.json({ success: true, data: profile });
});

app.post('/api/upload', requireAdminKey, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file provided' });
  }

  const baseUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
  const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
  res.json({
    success: true,
    data: {
      url: fileUrl,
      fileName: req.file.filename
    }
  });
});

app.post('/api/init', requireAdminKey, (req, res) => {
  res.json({ success: true, message: 'Demo data already loaded' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 Portfolio Backend Server (Simple Mode)');
  console.log('==========================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ Using IN-MEMORY storage (no PostgreSQL needed)`);
  console.log(`✅ Demo data pre-loaded: ${projects.length} projects`);
  console.log('');
  console.log('📡 API: http://localhost:' + PORT);
  console.log('📁 Uploads: ' + uploadsDir);
  console.log('');
  console.log('💡 Для продакшена используйте: node server.js (с PostgreSQL)');
  console.log('');
});
