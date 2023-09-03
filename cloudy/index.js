if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({ 
  cloud_name: process.env.CLN_CLOUD, 
  api_key: process.env.CLN_API_KEY, 
  api_secret: process.env.CLN_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder:'img',
    format: 'jpg'
  },
});

module.exports = {
	cloudinary,
	storage
}