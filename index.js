const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Set up storage engine for multer to save files locally
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save to 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Rename the file with timestamp
    },
});

const upload = multer({ storage });

// Route to handle image upload
app.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Send back the file path or any other response
    res.status(200).json({
        message: 'Image uploaded successfully',
        filePath: `/uploads/${req.file.filename}`,
    });
});

// Serve the uploaded files statically
app.use('/uploads', express.static(uploadDir));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
