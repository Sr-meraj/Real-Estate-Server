import express from 'express';
import { createResidency, getAllResidency, getResidency } from '../controllers/residencyCntrl.js';
const router = express.Router();

router.post('/:agentUserId/create', createResidency);
router.get('/allresed', getAllResidency);
router.get('/:id', getResidency);

export { router as residencyRoute };

