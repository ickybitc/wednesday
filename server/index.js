const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
}

// Handle image uploads
app.post('/upload', (req, res) => {
  console.log('Received upload request');
  try {
    const { image, timestamp } = req.body;
    console.log('Image data received, timestamp:', timestamp);
    
    // Remove the data URL prefix
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    
    // Save the image
    const filename = `picture-${timestamp}.png`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, buffer);
    
    console.log('Image saved successfully to:', filepath);
    res.json({ 
      success: true, 
      message: 'Image saved successfully',
      filename: filename
    });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to save image',
      details: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Upload directory: ${uploadDir}`);
}); 