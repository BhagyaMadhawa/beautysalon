// routes/salonRoutes.js
import express from "express";
import { authenticateToken, authorizeRoles } from "../middleware/auth.js";
import {
  createSalonOwner,
  createSalon,
  createPortfolio,
  createServices,
  setOperatingHours,
  addFaqs,
  approveSalon,
  getSalon,
  getSalonByUserId,
  getServices,
  getPortfolios,
  getFaqs,
  getOperatingHours,
  getSocialLinks,
  getSalonAddresses,
  getCertifications,
  getKeyInfo,
  getLanguages,
  getRandomSalons,
  getFilteredServices,
  updateSalon,
  updateSalonAddress,
  updateSocialLink,
  updateService,
  deleteService,
  updatePortfolio,
  addPortfolioImages,
  deletePortfolioImage,
  updateFaq,
  deleteFaq,
  updateKeyInfo,
  updateLanguages,
  getFilteredSalons,
  deletePortfolio,
} from "../controllers/salonController.js";

import { getServiceCategories } from "../controllers/servicesController.js";

import upload from "../middleware/upload.js";
import { put } from "@vercel/blob";

const router = express.Router();

/**
 * PUBLIC: Profile image upload (no auth)
 * Fixes the "Access token missing" issue.
 */
router.post("/upload/profile-image", upload.single("profile_image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // In production (Vercel): upload buffer to Blob storage
    if (process.env.NODE_ENV === "production") {
      const safeName = (req.file.originalname || "profile").replace(/\s+/g, "_");
      const key = `profiles/${Date.now()}-${safeName}`;

      const result = await put(key, req.file.buffer, {
        access: "public",
        contentType: req.file.mimetype,
      });

      // CDN-backed public URL
      return res.status(201).json({ imageUrl: result.url });
    }

    // Local dev: file saved to /uploads
    return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error("profile-image upload error", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});

// -------------------- PUBLIC GET ROUTES --------------------
router.get("/random", getRandomSalons);
router.get("/services", getFilteredServices);
router.get("/service-categories", getServiceCategories);
router.get("/user/:userId", getSalonByUserId);
router.get("/salons", getFilteredSalons);
router.get("/:salonId", getSalon);
router.get("/:salonId/services", getServices);
router.get("/:salonId/portfolios", getPortfolios);
router.get("/:salonId/faqs", getFaqs);
router.get("/:salonId/hours", getOperatingHours);
router.get("/:salonId/social-links", getSocialLinks);
router.get("/:salonId/addresses", getSalonAddresses);
router.get("/:salonId/certifications", getCertifications);
router.get("/:salonId/key-info", getKeyInfo);
router.get("/:salonId/languages", getLanguages);

// -------------------- PUBLIC CREATE ROUTES --------------------
router.post("/owneuser", createSalonOwner);
router.post("/", createSalon);
router.post("/:salonId/portfolios", createPortfolio);
router.post("/:salonId/services", upload.any(), createServices);
router.post("/:salonId/hours", setOperatingHours);
router.post("/:salonId/faqs", addFaqs);

// -------------------- PROTECTED ROUTES --------------------
router.patch("/admin/:id/approve", authenticateToken, authorizeRoles("admin"), approveSalon);

router.put("/:salonId", authenticateToken, updateSalon);
router.put("/:salonId/addresses/:addressId", authenticateToken, updateSalonAddress);
router.put("/:salonId/social-links/:linkId", authenticateToken, updateSocialLink);
router.put("/:salonId/services/:serviceId", authenticateToken, updateService);
router.delete("/:salonId/services/:serviceId", authenticateToken, deleteService);
router.put("/:salonId/portfolios/:portfolioId", authenticateToken, updatePortfolio);
router.post("/:salonId/portfolios/:portfolioId/images", authenticateToken, addPortfolioImages);
router.delete("/:salonId/portfolios/images/:imageId", authenticateToken, deletePortfolioImage);
router.delete("/:salonId/portfolios/:portfolioId", authenticateToken, deletePortfolio);
router.put("/:salonId/faqs/:faqId", authenticateToken, updateFaq);
router.delete("/:salonId/faqs/:faqId", authenticateToken, deleteFaq);
router.put("/:salonId/key-info", authenticateToken, updateKeyInfo);
router.put("/:salonId/languages", authenticateToken, updateLanguages);

export default router;
