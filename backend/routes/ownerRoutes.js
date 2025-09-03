import express from "express";
import {
  ownerStep1,
  ownerStep2,
  ownerStep3,
  ownerStep4,
  ownerStep5,
  ownerStep6,
} from "../controllers/ownerController.js";

const router = express.Router();

// Multi-step registration
router.post("/register/step1", ownerStep1); // create owner user
router.post("/register/step2", ownerStep2); // salon details
router.post("/register/step3", ownerStep3); // services
router.post("/register/step4", ownerStep4); // team members
router.post("/register/step5", ownerStep5); // gallery/photos
router.post("/register/step6", ownerStep6); // final confirmation

export default router;
