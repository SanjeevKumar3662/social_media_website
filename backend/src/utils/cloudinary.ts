import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;

    const uploadRes = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return uploadRes;
  } catch (error) {
    console.log("Cloudinary upload failed", error);
    return null;
  } finally {
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (error) {
      console.log("Cleanup failed", error);
    }
  }
};

export default cloudinary;
