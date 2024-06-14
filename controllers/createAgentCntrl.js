
import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createAgentUser = asyncHandler(async (req, res) => {
    console.log('agent creating');
    const { email } = req.body; // Receive data from the client
    try {
        // Create a new agent user in the database
        const agentExists = await prisma.agent.findUnique({ where: { email: email } });

        if (!agentExists) {
            const agentUser = await prisma.agent.create({ data: req.body });
            res.status(201).json({
                message: 'AgentUser registered successfully',
                agentUser,
            });// Respond with the created agent user
        } else {
            res.status(409).json({ message: 'Agent already registered' });
        }
    } catch (error) {
        console.error('Error creating agent user:', error);
        res.status(500).json({ error: 'An error occurred while creating the agent user' });
    }
});


export const updateAgent = asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    
    try {
        const agentUpdated = await prisma.agent.update({ 
            where:{id},
            data:updatedData
        })
        res.status(200).json(agentUpdated)
    } catch (err) {
        console.error("Error updating agent", err);
        res.status(500).json({message:"Could not update agent"})
    }
});

