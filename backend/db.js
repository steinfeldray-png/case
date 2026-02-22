import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'portfolio',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test database connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

// Initialize database tables
export async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(255) UNIQUE NOT NULL,
        title VARCHAR(255) NOT NULL,
        product VARCHAR(255) NOT NULL,
        platform VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        year VARCHAR(10) NOT NULL,
        challenge TEXT NOT NULL,
        solution TEXT NOT NULL,
        results JSONB DEFAULT '[]',
        tags JSONB DEFAULT '[]',
        image_url TEXT,
        case_images JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create profile table
    await client.query(`
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        photo_url TEXT,
        name VARCHAR(255),
        about TEXT,
        telegram_url TEXT,
        cv_url TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default profile if not exists
    await client.query(`
      INSERT INTO profile (id, name, telegram_url)
      SELECT 1, 'Alexander Petrov', 'https://t.me/saneuuu'
      WHERE NOT EXISTS (SELECT 1 FROM profile WHERE id = 1)
    `);

    await client.query('COMMIT');
    console.log('✅ Database tables initialized');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Helper functions for projects
export async function getAllProjects() {
  const result = await pool.query(
    'SELECT * FROM projects ORDER BY id ASC'
  );
  return result.rows;
}

export async function getProjectBySlug(slug) {
  const result = await pool.query(
    'SELECT * FROM projects WHERE slug = $1',
    [slug]
  );
  return result.rows[0];
}

export async function getProjectById(id) {
  const result = await pool.query(
    'SELECT * FROM projects WHERE id = $1',
    [id]
  );
  return result.rows[0];
}

export async function createProject(projectData) {
  const {
    slug, title, product, platform, description, year,
    challenge, solution, results, tags, imageUrl, caseImages
  } = projectData;

  const result = await pool.query(
    `INSERT INTO projects 
    (slug, title, product, platform, description, year, challenge, solution, results, tags, image_url, case_images)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *`,
    [slug, title, product, platform, description, year, challenge, solution,
     JSON.stringify(results || []), JSON.stringify(tags || []), imageUrl || null, JSON.stringify(caseImages || [])]
  );
  return result.rows[0];
}

export async function updateProject(id, projectData) {
  const {
    slug, title, product, platform, description, year,
    challenge, solution, results, tags, imageUrl, caseImages
  } = projectData;

  const result = await pool.query(
    `UPDATE projects 
    SET slug = $1, title = $2, product = $3, platform = $4, description = $5,
        year = $6, challenge = $7, solution = $8, results = $9, tags = $10,
        image_url = $11, case_images = $12, updated_at = CURRENT_TIMESTAMP
    WHERE id = $13
    RETURNING *`,
    [slug, title, product, platform, description, year, challenge, solution,
     JSON.stringify(results || []), JSON.stringify(tags || []), imageUrl || null, 
     JSON.stringify(caseImages || []), id]
  );
  return result.rows[0];
}

export async function deleteProject(id) {
  await pool.query('DELETE FROM projects WHERE id = $1', [id]);
}

// Helper functions for profile
export async function getProfile() {
  const result = await pool.query('SELECT * FROM profile WHERE id = 1');
  return result.rows[0] || {};
}

export async function updateProfile(profileData) {
  const { photoUrl, name, about, telegramUrl, cvUrl } = profileData;

  const result = await pool.query(
    `UPDATE profile 
    SET photo_url = $1, name = $2, about = $3, telegram_url = $4, cv_url = $5, updated_at = CURRENT_TIMESTAMP
    WHERE id = 1
    RETURNING *`,
    [photoUrl || null, name || null, about || null, telegramUrl || null, cvUrl || null]
  );
  return result.rows[0];
}

// Seed initial data
export async function seedDemoData() {
  const demoProjects = [
    {
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
      tags: ["E-commerce", "B2B", "Design System", "UX Research"]
    },
    {
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
      tags: ["Fintech", "Mobile First", "Security UX", "Onboarding"]
    },
    {
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
      tags: ["SaaS", "No-code", "Business Tools", "Dashboard Design"]
    },
    {
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
      tags: ["Marketplace", "Social Commerce", "Mobile App", "Visual Design"]
    }
  ];

  for (const project of demoProjects) {
    // Check if project already exists
    const existing = await pool.query('SELECT id FROM projects WHERE slug = $1', [project.slug]);
    if (existing.rows.length === 0) {
      await createProject(project);
    }
  }

  console.log('✅ Demo data seeded');
}

export default pool;
