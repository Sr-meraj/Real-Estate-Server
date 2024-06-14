import express from 'express';
import { userResidencies } from '../controllers/residencies.js';
import { bookRecidencies, cancelBooking, createUser, getAllBookedResidence, getAllFav, getUsers, toFav } from '../controllers/userCntrl.js';

const router = express.Router();

router.post('/register', createUser);
router.post('/bookvisit/:id', bookRecidencies)
router.post('/allbooked', getAllBookedResidence)
router.post('/cancelbook/:id', cancelBooking)
router.post('/favourite/:rid', toFav)
router.post('/allfav', getAllFav)
router.get('/all', getUsers)
router.get('/:agentUserId/residencies', userResidencies);

export { router as userRoute };

