import asyncHandler from 'express-async-handler';
import { prisma } from '../config/prismaConfig.js';

export const createUser = asyncHandler(async (req, res) => {
    console.log('creating a user');
    const { email } = req.body;
    console.log(req.body);
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (!userExists) {
        const user = await prisma.user.create({ data: req.body });
        res.status(201).json({
            message: 'User registered successfully',
            user,
        });
    } else {
        res.status(409).json({ message: 'User already registered' });
    }
});

//* function a booked residency
export const bookRecidencies = asyncHandler(async (req, res) => {
    const { email, date } = req.body;
    const { id } = req.params;
    try {
        const alreadyBooked = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })

        if (alreadyBooked.bookedVisits.some((booked) => booked.id === id)) {
            return res.status(403).json({ message: 'This Residency already booked' }); // forbidden
        } else {
            const updatedResident = await prisma.user.update({
                where: { email: email },
                data: { 
                    bookedVisits: { push: {id, date} }
                    }
            });
            res.status(200).json({
                message: "Successfully Booked",
                resident: updatedResident
            });
            
        }

    } catch (error) {
        throw new Error(`Error in getting the list of booked visits ${error.message}`);
    }
})

//* A function to get all Booked residency 
export const getAllBookedResidence = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        const bookedVisits = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        });
        res.status(200).json(bookedVisits);
        
    } catch (error) {
        throw new Error(`Error in getting the list of booked visits ${error.message}`);
    }
})

//* A function to cancel bookings
export const cancelBooking = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: { bookedVisits: true }
        })
        
        const index = user.bookedVisits.findIndex((visit)=> visit.id === id)
        // console.log(index);

        if (index !== -1) {
            user.bookedVisits.splice(index, 1)

            await prisma.user.update({
                where: { email: email },
                data: {
                    bookedVisits: user.bookedVisits 
                }
            })
            
            res.status(200).json({
                message: "Cancelled Successfully"
            });
            
        } else {
            return res.status(404).send('No such booking found');
        }

    } catch (error) {
        console.log('err', error);
        throw new Error(`Error in cancelling a visit ${error.message}`);
    }
});

//* A function toFavourite document/residency
export const toFav = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const { rid } = req.params;

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        console.log(user.favResidenciesID.includes(rid));

        if (!user.favResidenciesID.includes(rid)) {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        push: rid,
                    }
                }
            })
            res.status(201).json({
                message: "Update favourite Successfully",
                data: updateUser
            });
        } else {
            const updateUser = await prisma.user.update({
                where: { email },
                data: {
                    favResidenciesID: {
                        set: user.favResidenciesID.filter(id => id !== rid)
                    }
                }
            });
            res.status(201).json({
                message: "Removed favourite Successfully",
                data: updateUser
            });
        }
        
    } catch (err) {
        console.log('err', err);
        throw new Error(err.message)
    }
});

//* a function to get all favourites
export const getAllFav = asyncHandler(async (req, res) => {
    const { email } = req.body
    try {
        const favs = await prisma.user.findUnique({
            where: { email },
            select: {
                favResidenciesID: true
            }
        })
        res.status(201).send(favs);
    } catch (err) {
        throw new Error(err.message)
    }
})

// * fuction to get all users
export const getUsers = asyncHandler(async (req, res)=>{
    try{
        const users = await prisma.user.findMany();
        res.status(200).json(users);
    } catch (err) {
        console.error("Error getting all users", err);
        res.status(500).json({message:"Could not retrieve users"})
    }
})