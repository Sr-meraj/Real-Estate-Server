
 import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

 export const userResidencies = asyncHandler(async (req, res) => {
  try {
    const UserId = req.params.agentUserId;

    // Check if the agent user exists
    const User = await prisma.user.findUnique({
      where: { id: UserId },
      include: {
        ownedResidencies: true, // Include the ownedResidencies relationship
      },
    });

    if (!User) {
      return res.status(404).json({ error: 'Agent user not found' });
    }

    const residencies = User.ownedResidencies;

    res.json(residencies); // Respond with the agent's owned residencies
  } catch (error) {
    console.error('Error getting agent residencies:', error);
    res.status(500).json({ error: 'An error occurred while retrieving agent residencies' });
  }
});
