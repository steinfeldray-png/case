import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import {
  initDatabase,
  getAllProjects,
  getProjectBySlug,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProfile,
  updateProfile,
  seedDemoData
} from './db.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || origin.includes('vercel.app')) {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Uploads directory created:', uploadsDir);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
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
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDF files are allowed.'));
    }
  }
});

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await getAllProjects();
    
    // Convert snake_case to camelCase for frontend compatibility
    const formattedProjects = projects.map(project => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      product: project.product,
      platform: project.platform,
      description: project.description,
      year: project.year,
      challenge: project.challenge,
      solution: project.solution,
      results: project.results,
      tags: project.tags,
      imageUrl: project.image_url,
      caseImages: project.case_images
    }));

    res.json({ success: true, data: formattedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single project by slug
app.get('/api/projects/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await getProjectBySlug(slug);

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Convert snake_case to camelCase
    const formattedProject = {
      id: project.id,
      slug: project.slug,
      title: project.title,
      product: project.product,
      platform: project.platform,
      description: project.description,
      year: project.year,
      challenge: project.challenge,
      solution: project.solution,
      results: project.results,
      tags: project.tags,
      imageUrl: project.image_url,
      caseImages: project.case_images
    };

    res.json({ success: true, data: formattedProject });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create new project
app.post('/api/projects', async (req, res) => {
  try {
    const projectData = {
      slug: req.body.slug,
      title: req.body.title,
      product: req.body.product,
      platform: req.body.platform,
      description: req.body.description,
      year: req.body.year,
      challenge: req.body.challenge,
      solution: req.body.solution,
      results: req.body.results,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      caseImages: req.body.caseImages
    };

    const newProject = await createProject(projectData);

    // Convert snake_case to camelCase
    const formattedProject = {
      id: newProject.id,
      slug: newProject.slug,
      title: newProject.title,
      product: newProject.product,
      platform: newProject.platform,
      description: newProject.description,
      year: newProject.year,
      challenge: newProject.challenge,
      solution: newProject.solution,
      results: newProject.results,
      tags: newProject.tags,
      imageUrl: newProject.image_url,
      caseImages: newProject.case_images
    };

    res.json({ success: true, data: formattedProject });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update project
app.put('/api/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const projectData = {
      slug: req.body.slug,
      title: req.body.title,
      product: req.body.product,
      platform: req.body.platform,
      description: req.body.description,
      year: req.body.year,
      challenge: req.body.challenge,
      solution: req.body.solution,
      results: req.body.results,
      tags: req.body.tags,
      imageUrl: req.body.imageUrl,
      caseImages: req.body.caseImages
    };

    const updatedProject = await updateProject(id, projectData);

    if (!updatedProject) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    // Convert snake_case to camelCase
    const formattedProject = {
      id: updatedProject.id,
      slug: updatedProject.slug,
      title: updatedProject.title,
      product: updatedProject.product,
      platform: updatedProject.platform,
      description: updatedProject.description,
      year: updatedProject.year,
      challenge: updatedProject.challenge,
      solution: updatedProject.solution,
      results: updatedProject.results,
      tags: updatedProject.tags,
      imageUrl: updatedProject.image_url,
      caseImages: updatedProject.case_images
    };

    res.json({ success: true, data: formattedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete project
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await deleteProject(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get profile
app.get('/api/profile', async (req, res) => {
  try {
    const profile = await getProfile();
    
    // Convert snake_case to camelCase
    const formattedProfile = {
      photoUrl: profile.photo_url,
      name: profile.name,
      about: profile.about,
      telegramUrl: profile.telegram_url,
      cvUrl: profile.cv_url
    };

    res.json({ success: true, data: formattedProfile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update profile
app.put('/api/profile', async (req, res) => {
  try {
    const profileData = {
      photoUrl: req.body.photoUrl,
      name: req.body.name,
      about: req.body.about,
      telegramUrl: req.body.telegramUrl,
      cvUrl: req.body.cvUrl
    };

    const updatedProfile = await updateProfile(profileData);

    // Convert snake_case to camelCase
    const formattedProfile = {
      photoUrl: updatedProfile.photo_url,
      name: updatedProfile.name,
      about: updatedProfile.about,
      telegramUrl: updatedProfile.telegram_url,
      cvUrl: updatedProfile.cv_url
    };

    res.json({ success: true, data: formattedProfile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Upload image/file
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file provided' });
    }

    // Generate public URL for the uploaded file
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${PORT}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    console.log('✅ File uploaded:', req.file.filename);

    res.json({
      success: true,
      data: {
        url: fileUrl,
        fileName: req.file.filename
      }
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Initialize database with demo data
app.post('/api/init', async (req, res) => {
  try {
    await seedDemoData();
    res.json({ success: true, message: 'Database initialized with demo data' });
  } catch (error) {
    console.error('Error initializing database:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size exceeds 5MB limit'
      });
    }
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
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
async function startServer() {
  try {
    // Initialize database
    await initDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 Portfolio Backend Server');
      console.log('================================');
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✅ Uploads directory: ${uploadsDir}`);
      console.log('');
      console.log('📡 Available endpoints:');
      console.log(`   GET  /health`);
      console.log(`   GET  /api/projects`);
      console.log(`   GET  /api/projects/:slug`);
      console.log(`   POST /api/projects`);
      console.log(`   PUT  /api/projects/:id`);
      console.log(`   DELETE /api/projects/:id`);
      console.log(`   GET  /api/profile`);
      console.log(`   PUT  /api/profile`);
      console.log(`   POST /api/upload`);
      console.log(`   POST /api/init`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
