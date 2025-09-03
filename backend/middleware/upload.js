import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.join(path.dirname(new URL(import.meta.url).pathname), "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `image_${Date.now()}${ext}`);
  },
});

export default multer({ storage });
//hhghggfhgh
