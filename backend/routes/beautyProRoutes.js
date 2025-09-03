import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import beautyProController from "../controllers/beautyProController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

router.post("/", authenticateToken, authorizeRoles("service_provider"), upload.single("profile_image"), beautyProController.createBeautyPro);
router.post("/:userId/portfolios", authenticateToken, authorizeRoles("service_provider"), beautyProController.createPortfolio);
router.post("/:userId/services", authenticateToken, authorizeRoles("service_provider"), beautyProController.createServices);
router.post("/:userId/faqs", authenticateToken, authorizeRoles("service_provider"), beautyProController.addFaqs);
router.patch("/admin/:userId/approve", authenticateToken, authorizeRoles("admin"), beautyProController.approveBeautyPro);

export default router;
