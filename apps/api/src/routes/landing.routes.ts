import { Router } from 'express';
import { HeroSlideController } from '../controllers/hero-slide.controller';
import { HighlightController, GalleryController, PartnerController, LandingSettingsController } from '../controllers/landing.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { FileUploadService } from '../services/file-upload.service';
import { UploadController } from '../controllers/upload.controller';

const router = Router();

// Hero Slides - Public
router.get('/hero-slides', HeroSlideController.getAll);
router.get('/hero-slides/:id', HeroSlideController.getById);

// Hero Slides - Admin (protected)
router.get('/admin/hero-slides', authenticate, HeroSlideController.getAllAdmin);
router.post('/admin/hero-slides', authenticate, HeroSlideController.create);
router.put('/admin/hero-slides/:id', authenticate, HeroSlideController.update);
router.delete('/admin/hero-slides/:id', authenticate, HeroSlideController.delete);
router.post('/admin/hero-slides/reorder', authenticate, HeroSlideController.reorder);

// Highlights - Public
router.get('/highlights', HighlightController.getAll);
router.get('/highlights/:id', HighlightController.getById);

// Highlights - Admin (protected)
router.get('/admin/highlights', authenticate, HighlightController.getAllAdmin);
router.post('/admin/highlights', authenticate, HighlightController.create);
router.put('/admin/highlights/:id', authenticate, HighlightController.update);
router.delete('/admin/highlights/:id', authenticate, HighlightController.delete);
router.post('/admin/highlights/reorder', authenticate, HighlightController.reorder);

// Gallery - Public
router.get('/gallery', GalleryController.getAll);
router.get('/gallery/:id', GalleryController.getById);

// Gallery - Admin (protected)
router.get('/admin/gallery', authenticate, GalleryController.getAllAdmin);
router.post('/admin/gallery', authenticate, GalleryController.create);
router.put('/admin/gallery/:id', authenticate, GalleryController.update);
router.delete('/admin/gallery/:id', authenticate, GalleryController.delete);
router.post('/admin/gallery/reorder', authenticate, GalleryController.reorder);
router.post(
  '/admin/gallery/upload/:category',
  authenticate,
  (req, res, next) => {
    const upload = FileUploadService.getMulterConfig(req.params.category);
    upload.array('files', 10)(req, res, next);
  },
  UploadController.uploadMultiple
);

// Partners - Public
router.get('/partners', PartnerController.getAll);
router.get('/partners/:id', PartnerController.getById);

// Partners - Admin (protected)
router.get('/admin/partners', authenticate, PartnerController.getAllAdmin);
router.post('/admin/partners', authenticate, PartnerController.create);
router.put('/admin/partners/:id', authenticate, PartnerController.update);
router.delete('/admin/partners/:id', authenticate, PartnerController.delete);
router.post('/admin/partners/reorder', authenticate, PartnerController.reorder);

// Landing Settings - Public
router.get('/settings/:section', LandingSettingsController.get);
router.get('/settings', LandingSettingsController.getAll);

// Landing Settings - Admin (protected)
router.post('/admin/settings/:section', authenticate, LandingSettingsController.upsert);
router.delete('/admin/settings/:section', authenticate, LandingSettingsController.delete);

export default router;
