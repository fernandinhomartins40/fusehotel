import { Router } from 'express';
import { TeamMemberController } from '../controllers/team-member.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Team Members - Public
router.get('/team-members', TeamMemberController.getAll);
router.get('/team-members/:id', TeamMemberController.getById);

// Team Members - Admin (protected)
router.get('/admin/team-members', authenticate, TeamMemberController.getAllAdmin);
router.post('/admin/team-members', authenticate, TeamMemberController.create);
router.put('/admin/team-members/:id', authenticate, TeamMemberController.update);
router.delete('/admin/team-members/:id', authenticate, TeamMemberController.delete);
router.post('/admin/team-members/reorder', authenticate, TeamMemberController.reorder);

export default router;
