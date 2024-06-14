import express from 'express';
import { createAgentUser, getAgents } from '../controllers/createAgentCntrl.js';
import { agentResidencies } from '../controllers/residencies.js';
const router = express.Router();


// Endpoint to create an agent users
router.post('/register', createAgentUser);
router.get('/:agentUserId/residencies', agentResidencies);
router.get('/all', getAgents)

export { router as agentRoute };

