// Backend: uploadPdfToCloudinary.js
const cloudinary = require('./cloudinary.config');
const fs = require('fs');

const uploadPdfToCloudinary = async (pdfPath) => {
  try {
    const result = await cloudinary.uploader.upload(pdfPath, {
      resource_type: 'raw', // 'raw' is for files like PDFs
      folder: 'patient_files', // Optional: Store in a specific folder
    });
    console.log('Uploaded PDF URL:', result.secure_url);
    return result.secure_url; // Return the Cloudinary URL
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw new Error('Cloudinary upload failed');
  } finally {
    // Clean up the local file if necessary
    fs.unlinkSync(pdfPath);
  }
};

module.exports = uploadPdfToCloudinary;
