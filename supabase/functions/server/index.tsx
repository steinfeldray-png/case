import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Initialize storage bucket
const BUCKET_NAME = 'make-9dcb623e-project-images';

async function ensureBucketExists() {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
      if (error) {
        console.error('Error creating bucket:', error);
      } else {
        console.log('Bucket created successfully:', BUCKET_NAME);
      }
    }
  } catch (error) {
    console.error('Error ensuring bucket exists:', error);
  }
}

// Ensure bucket exists on startup
ensureBucketExists();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-9dcb623e/health", (c) => {
  return c.json({ status: "ok" });
});

// Get all projects
app.get("/make-server-9dcb623e/projects", async (c) => {
  try {
    const projects = await kv.getByPrefix("project:");
    const sortedProjects = projects.sort((a, b) => a.id - b.id);
    return c.json({ success: true, data: sortedProjects });
  } catch (error) {
    console.log("Error fetching projects:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get single project by slug
app.get("/make-server-9dcb623e/projects/:slug", async (c) => {
  try {
    const slug = c.req.param("slug");
    const projects = await kv.getByPrefix("project:");
    const project = projects.find((p) => p.slug === slug);
    
    if (!project) {
      return c.json({ success: false, error: "Project not found" }, 404);
    }
    
    return c.json({ success: true, data: project });
  } catch (error) {
    console.log("Error fetching project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Create new project
app.post("/make-server-9dcb623e/projects", async (c) => {
  try {
    const body = await c.req.json();
    const projects = await kv.getByPrefix("project:");
    const maxId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) : 0;
    const newProject = { ...body, id: maxId + 1 };
    
    await kv.set(`project:${newProject.id}`, newProject);
    return c.json({ success: true, data: newProject });
  } catch (error) {
    console.log("Error creating project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Update project
app.put("/make-server-9dcb623e/projects/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"));
    const body = await c.req.json();
    const updatedProject = { ...body, id };
    
    await kv.set(`project:${id}`, updatedProject);
    return c.json({ success: true, data: updatedProject });
  } catch (error) {
    console.log("Error updating project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Delete project
app.delete("/make-server-9dcb623e/projects/:id", async (c) => {
  try {
    const id = c.req.param("id");
    await kv.del(`project:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.log("Error deleting project:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Get profile settings
app.get("/make-server-9dcb623e/profile", async (c) => {
  try {
    const profile = await kv.get("profile:settings");
    // Return empty object if no profile exists
    return c.json({ success: true, data: profile || {} });
  } catch (error) {
    console.log("Error fetching profile:", error);
    return c.json({ success: false, error: String(error), data: {} }, 500);
  }
});

// Update profile settings
app.put("/make-server-9dcb623e/profile", async (c) => {
  try {
    const body = await c.req.json();
    await kv.set("profile:settings", body);
    return c.json({ success: true, data: body });
  } catch (error) {
    console.log("Error updating profile:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Upload image endpoint
app.post("/make-server-9dcb623e/upload-image", async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ success: false, error: 'No file provided' }, 400);
    }

    // Validate file type - allow images and PDFs
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ success: false, error: 'Invalid file type. Only images and PDF files are allowed.' }, 400);
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ success: false, error: 'File size exceeds 5MB limit' }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${timestamp}-${crypto.randomUUID()}.${fileExt}`;
    
    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading to storage:', error);
      return c.json({ success: false, error: `Storage upload error: ${error.message}` }, 500);
    }

    // Generate signed URL (valid for 10 years)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 315360000); // 10 years in seconds

    if (signedUrlError) {
      console.error('Error creating signed URL:', signedUrlError);
      return c.json({ success: false, error: `Signed URL error: ${signedUrlError.message}` }, 500);
    }

    return c.json({ 
      success: true, 
      data: { 
        url: signedUrlData.signedUrl,
        fileName: fileName 
      } 
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

// Initialize database with sample data
app.post("/make-server-9dcb623e/init", async (c) => {
  try {
    const initialProjects = [
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
        tags: ["E-commerce", "B2B", "Design System", "UX Research"]
      },
      {
        id: 2,
        slug: "crypto-wallet",
        title: "Crypto Wallet",
        product: "Финтех",
        platform: "Web, Mobile",
        description: "Разработка интерфейса криптовалютного кошелька",
        year: "2023",
        challenge: "Создать интуитивный интерфейс криптокошелька для новичков, сохранив при этом продвинутый функционал для опытных пользователей. Глвная проблема — баланс между простотой и безопасностью.",
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
        tags: ["SaaS", "No-code", "Business Tools", "Dashboard Design"]
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
        tags: ["Marketplace", "Social Commerce", "Mobile App", "Visual Design"]
      }
    ];

    for (const project of initialProjects) {
      await kv.set(`project:${project.id}`, project);
    }

    return c.json({ success: true, message: "Database initialized with sample projects" });
  } catch (error) {
    console.log("Error initializing database:", error);
    return c.json({ success: false, error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);