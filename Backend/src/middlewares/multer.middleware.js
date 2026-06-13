import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      // Never trust the client filename — it can contain "../" (path traversal)
      // and duplicate names collide/overwrite. Generate a safe, unique name.
      const ext = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, "");
      const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
      cb(null, unique);
    }
  })

export const upload = multer({
    storage,
});