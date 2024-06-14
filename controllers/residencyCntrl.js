import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

 const createResidency = asyncHandler(async (req, res) => {
    const {
        title, address, city, country, residencyStatus,
        description, price, facilities, images, availability, features
    } = req.body.data
    
     try {
            const agentUserId = req.params.agentUserId;

            // Check if the agent user exists
            const agentUser = await prisma.user.findUnique({
                where: { id: agentUserId },
            });

            if (!agentUser) {
            return res.status(404).json({ error: 'User not found' });
         }

         const newResidence = await prisma.residency.create({
             data: {
                 title, address, city, country, residencyStatus, description, price, facilities, images, availability,features,
                 owner: { connect: { email: agentUser.email } }
             }
         });
        
         if (!newResidence) throw "Failed to add residence";
         return res.status(201).json({ message: `Successfully added ${title}`, data: newResidence });
         
    } catch (err) {
        console.log('Error in creating a new Residence', err);
        if (err.code === "P2002") {
            throw new Error('A residence with address already there.')
        }
        throw new Error(err.message);
    }
 });

 //* function to get all document residency

// const getAllResidency = asyncHandler(async (req, res) => {
//     const { items } = req.query;
    
//     const Residencies = await prisma.residency.findMany({
//          take: parseInt(items)|| 999999999,
//         orderBy: {
//             createdAt: 'desc',
//         },
//         select: {
//             id: true, title: true, facilities: true, address: true, city: true, country: true, images: true, residencyStatus: true, price: true, availability: true
//         },
//     });
//     return res.status(200).send(Residencies);
// });

const getAllResidency = asyncHandler(async (req, res) => {
    const { items, residencyStatus } = req.query;

    try {
        const filterOptions = {};

        if (residencyStatus) {
            filterOptions.residencyStatus = residencyStatus;
            console.log(residencyStatus);
        }

        const Residencies = await prisma.residency.findMany({
            take: parseInt(items) || 999999999,
            orderBy: {
                createdAt: 'desc',
            },
            where: filterOptions,
            select: {
                id: true,
                title: true,
                facilities: true,
                address: true,
                city: true,
                country: true,
                images: true,
                residencyStatus: true,
                price: true,
                availability: true,
            },
        });

        return res.status(200).send(Residencies);
    } catch (err) {
        throw new Error(err.message);
    }
});

const getResidency = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const Residency = await prisma.residency.findUnique({
            where: { id },
            include: {
                owner: true, // Include the owner (agent) information
            },
        });
        if (!Residency) throw new Error("No such Residency found");
        console.log(Residency);
        return res.status(200).send(Residency);
        
    } catch (err) {
        throw new Error(err.message)
    }
});


export { getAllResidency, createResidency, getResidency };

