const cloudinary = require("../config/cloudinary");
const fs = require("fs").promises;


const uploadToCloudinary = async (localFilePath) =>{
    try {
        const result = await cloudinary.uploader.upload(localFilePath, {
            folder : "UpSkillr",
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };

    } catch (error) {
       
       console.error( "Failed to upload file to cloudinary: " ,error);
       throw error;
    } finally{
        try {
            await fs.unlink(localFilePath); 
            console.log("Temp file deleted:", localFilePath);
        } catch (err) {
            console.error("Failed to delete temp file:", err);
        }
    }
}




const deleteFromCloudinary = async (publicId) => {
	if (!publicId) return;

	try {
		const result = await cloudinary.uploader.destroy(publicId);

		if (result.result === "ok" || result.result === "not found") {
			console.log(`Cloudinary deletion successful: ${publicId}`);
		} else {
			console.error(`Cloudinary deletion issue for ${publicId}:`, result);
			throw new Error(`Cloudinary deletion failed for ${publicId}`);
		}
	} catch (err) {
		console.error("Cloudinary deletion error:", err);
		throw err;
	}
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
