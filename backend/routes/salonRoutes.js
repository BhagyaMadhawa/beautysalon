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
  // Update functions
  updateSalon,
  updateSalonAddress,
  updateSocialLink,
  updateService,
  deleteService,
  updatePortfolio,
  addPortfolioImages,
  deletePortfolioImage,
  deletePortfolio,
  updateFaq,
  deleteFaq,
  getFilteredSalons
} from "../controllers/salonController.js";
import upload from "../middleware/upload.js";
const router = express.Router();

// GET routes (public)
router.get("/random", getRandomSalons); // New route for random salons
router.get("/services", getFilteredServices); // New route for filtered services
router.get("/user/:userId", getSalonByUserId); // Get salon by user ID for dashboard
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
router.post("/owneuser", createSalonOwner);
router.post("/", createSalon);
router.post("/:salonId/portfolios", createPortfolio);
router.post("/:salonId/services", createServices);
router.post("/:salonId/hours", setOperatingHours);
router.post("/:salonId/faqs", addFaqs);
router.patch("/admin/:id/approve", authenticateToken, authorizeRoles("admin"), approveSalon);

// New route for profile image upload
// router.post("/upload/profile-image", upload.single("profile_image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }
//   const imageUrl = `/uploads/${req.file.filename}`;
//   res.status(201).json({ imageUrl });
// });

router.post('/upload/profile-image', upload.single('profile_image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // In production (Vercel): upload the in-memory buffer to Blob storage
    if (process.env.NODE_ENV === 'production') {
      const safeName = (req.file.originalname || 'profile').replace(/\s+/g, '_');
      const key = `profiles/${Date.now()}-${safeName}`;

      const result = await put(key, req.file.buffer, {
        access: 'public',
        contentType: req.file.mimetype,
      });

      // CDN-backed public URL
      return res.status(201).json({ imageUrl: result.url });
    }

    // Local dev: diskStorage wrote the file to /uploads
    return res.status(201).json({ imageUrl: `/uploads/${req.file.filename}` });
  } catch (err) {
    console.error('profile-image upload error', err);
    return res.status(500).json({ error: 'Upload failed' });
  }
});

// UPDATE ROUTES (Protected - require authentication)
router.put("/:salonId", authenticateToken, updateSalon); // Update salon basic info
router.put("/:salonId/addresses/:addressId", authenticateToken, updateSalonAddress); // Update salon address
router.put("/:salonId/social-links/:linkId", authenticateToken, updateSocialLink); // Update social link
router.put("/:salonId/services/:serviceId", authenticateToken, updateService); // Update service
router.delete("/:salonId/services/:serviceId", authenticateToken, deleteService); // Delete service
router.put("/:salonId/portfolios/:portfolioId", authenticateToken, updatePortfolio); // Update portfolio album name
router.post("/:salonId/portfolios/:portfolioId/images", authenticateToken, addPortfolioImages); // Add images to portfolio
router.delete("/:salonId/portfolios/images/:imageId", authenticateToken, deletePortfolioImage); // Delete portfolio image
router.delete("/:salonId/portfolios/:portfolioId", authenticateToken, deletePortfolio); // Delete entire portfolio
router.put("/:salonId/faqs/:faqId", authenticateToken, updateFaq); // Update FAQ
router.delete("/:salonId/faqs/:faqId", authenticateToken, deleteFaq); // Delete FAQ

export default router;
