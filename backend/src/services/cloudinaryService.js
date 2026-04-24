const cloudinary = require('cloudinary').v2;


/**
 * Uploads an image to Cloudinary and returns the secure URL.
 * * @param {string} fileToUpload - The local file path or a base64 encoded image string.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
const uploadImage = async (fileToUpload) => {
    try {
        const result = await cloudinary.uploader.upload(fileToUpload, {
            // Optional: You can specify a folder in your Cloudinary account
            folder: 'my_express_app_uploads', 
            // Optional: You can apply transformations here (like resizing)
            transformation: [{ width: 1500, height: 1000, crop: 'limit' }] 
        });

        // The 'secure_url' is the HTTPS link to your stored image
        return result.secure_url; 

    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};

module.exports = {
    uploadImage
};