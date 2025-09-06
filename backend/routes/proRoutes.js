import { Router } from "express";
import {
  proRegister,        // Step 1 (public)
  profileStep,        // Step 2
  portfolioStep,      // Step 3
  servicesStep,       // Step 4
  faqsStep,           // Step 5
  myProProfile,       // helper
} from "../controllers/proController.js";

import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Step 1 is PUBLIC – no token yet
router.post("/register", proRegister);

// Auth required from here
//router.use(requireAuth);
router.post("/profile", profileStep);
router.post("/portfolio", portfolioStep);
router.post("/services", servicesStep);
router.post("/faqs", faqsStep);
router.get("/me", myProProfile);

export default router;
