// Import required modules
const express = require('express'); 
const cors = require('cors'); 
const volleyball = require('volleyball');
const multer = require('multer');
const cloudinary = require('cloudinary'); 
require('dotenv').config(); 
const path = require('path');
const fs = require('fs');


// Declare uploads folder path
const uploadsPath = path.join(process.cwd(), 'uploads');

// Check if uploads folder exists and create it otherwise
try {
  fs.accessSync(uploadsPath);
} catch (error) {
  fs.mkdirSync(uploadsPath);
}

// Create express app
const app = express();

// Setup multer upload instance for handling local file uploading
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, uploadsPath);
    },
    filename: (req, file, callback) => {
      const originalFilename = `${new Date().getTime()}_${file.originalname}`;
      callback(null, originalFilename);
    },
  }),
});

// Configure global middlewares
app.use(volleyball);
app.use(
  cors({
    origin: '*',
  })
); 
app.use(express.json()); 

// Configure cloudinary for uploading files to the cloud
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup routes
// Upload file
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      resource_type: 'auto',
      use_filename: true,
    });
    fs.unlinkSync(req.file.path);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Get uploaded files
app.get('/', async (req, res) => {
  try {
    const result = await cloudinary.v2.api.search('*');
    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});
// Delete existing file
app.delete('/:id', async (req, res) => {
  try {
  
    const { id } = req.params;
    
    const { resourceType } = req.body;

    try {
      await cloudinary.v2.api.resource(id, {
        resource_type: resourceType,
      });
    } catch (error) {
    
      res.status(error.error.http_code).json(error.error);
      return;
    }

    const result = await cloudinary.v2.api.delete_resources(id, {
      resource_type: resourceType,
    });

    res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
