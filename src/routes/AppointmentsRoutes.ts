const fs = require('fs');
const path = require('path');

import moment = require("moment");
import { IAppointment } from "../models/IAppointment";
import { IPet } from "../models/IPet";

// Importing the module 
const express=require("express") 
  
// Creating express Router 
const router=express.Router()

const filePath = path.join(`${__dirname}/../data/`, 'appoitments.json');
let appointmentList: IAppointment[] = [];

fs.readFile(filePath, (err, data: any) => {
    if (err) {
        console.error("Unable to open file : " + filePath);
    } else {
        appointmentList = JSON.parse(data);
    }
})

const petsFilePath = path.join(`${__dirname}/../data/`, 'pets.json');
let petsList: IPet[] = [];

fs.readFile(petsFilePath, (err, data: any) => {
    if (err) {
        console.error("Unable to open pet file : " + petsFilePath);
    } else {
        petsList = JSON.parse(data);
    }
})
  
router.get("/", (req, resp) => {
    if (req.query.phoneNumber) {
        let appointments = appointmentList.filter(a => a.phoneNumber == req.query.phoneNumber);

        appointments.map(appointment => {
            appointment.petName = petsList.find(pet => pet.id == appointment.petId)?.breed || '';
        })

        resp.status(200);
        return resp.json(appointments);
    }

    resp.status(200);
    return resp.json(appointmentList);
});

router.get("/:id", (req, resp) => {
    if (req.params.id) {
        const appointment = appointmentList.find(a => a.id == req.params.id);
        if (appointment) {
            resp.status(200);
            return resp.json(appointment);
        }

        resp.status(404);
        return resp.json({error: `Appointment with id:${req.params.id} not found.`});
    }
})

router.post("/", (req, resp) => {
    const {firstName, lastName, phoneNumber, address, state, zipCode, 
        appointmentDate, appointmentTime, petId} = req.body;

    if (!firstName) {
        resp.status(200);
        return resp.json({error: 'firstName is required.'})
    }

    if (!lastName) {
        resp.status(200);
        return resp.json({error: 'lastName is required.'})
    }

    if (!phoneNumber) {
        resp.status(200);
        return resp.json({error: 'phoneNumber is required.'})
    }

    if(isNaN(phoneNumber) || phoneNumber < 1000000000 || phoneNumber > 99999999999) {
        resp.status(200);
        return resp.json({error: 'Invalid phonNumber'})
    }

    if (!address) {
        resp.status(200);
        return resp.json({error: 'address is required.'})
    }

    if (!state) {
        resp.status(200);
        return resp.json({error: 'state is required.'})
    }

    if (!zipCode) {
        resp.status(200);
        return resp.json({error: 'zipCode is required.'})
    }

    if(isNaN(zipCode) || zipCode < 10000 || zipCode > 99999) {
        resp.status(200);
        return resp.json({error: 'Invalid zipCode'})
    }

    if (!appointmentDate) {
        resp.status(200);
        return resp.json({error: 'appointmentDate is required.'})
    }

    if (!appointmentTime) {
        resp.status(200);
        return resp.json({error: 'appointmentTime is required.'})
    }

    if (!petId) {
        resp.status(200);
        return resp.json({error: 'petId is required.'})
    }

    if(isNaN(petId)) {
        resp.status(200);
        return resp.json({error: 'Invalid petId'})
    }

    const compareDate = moment(appointmentDate + ' ' + appointmentTime, "MM/DD/YYYY HH:mm:ss");
    const appointmentByPhone = appointmentList.find(a => {
        const startDate = moment(a.appointmentDate + ' ' + a.appointmentTime, "MM/DD/YYYY HH:mm:ss").subtract(1, 'second');
        const endDate = moment(a.appointmentDate + ' ' + a.appointmentTime, "MM/DD/YYYY HH:mm:ss").add(1, 'hour');

        return a.phoneNumber == phoneNumber && a.petId == petId && compareDate.isBetween(startDate, endDate);
    });

    if (appointmentByPhone) {
        resp.status(200);
        return resp.json({
            error: 'You already have an appointment booked for this pet'
        });
    }

    const id = appointmentList.length > 0 ? appointmentList[appointmentList.length - 1].id + 1 : 1;

    const appointment:IAppointment = {
        id,
        firstName, 
        lastName, 
        phoneNumber,
        address, 
        state, 
        zipCode, 
        appointmentDate, 
        appointmentTime, 
        petId
    }

    appointmentList.push(appointment);

    resp.status(200);
    return resp.json(appointment);
})

router.put("/:id", (req, resp) => {
    if (req.params.id) {
        let appointmentUpdated: IAppointment | null = null;

        for(let appointment of appointmentList) {
            if (appointment.id == req.params.id) {
                const {firstName, lastName, phoneNumber, address, state, zipCode, 
                    appointmentDate, appointmentTime, petId} = req.body;
        
                if (firstName) {
                    appointment.firstName = firstName;
                }
                if (lastName) {
                    appointment.lastName = lastName;
                }
                if (phoneNumber) {
                    appointment.phoneNumber = phoneNumber;
                }
                if (address) {
                    appointment.address = address;
                }
                if (state) {
                    appointment.state = state;
                }
                if (zipCode) {
                    appointment.zipCode = zipCode;
                }
                if (appointmentDate) {
                    appointment.appointmentDate = appointmentDate;
                }
                if (appointmentTime) {
                    appointment.appointmentTime = appointmentTime;
                }
                if (petId) {
                    appointment.petId = petId;
                }

                appointmentUpdated = appointment;
                break;
            }
        }

        if (!appointmentUpdated) {
            resp.status(404);
            return resp.json({error: `Appointment with id:${req.params.id} not found.`});
        }

        const compareDate = moment(appointmentUpdated.appointmentDate + ' ' + appointmentUpdated.appointmentTime, "MM/DD/YYYY HH:mm:ss");
        const appointmentByPhone = appointmentList.find(a => {
            const startDate = moment(a.appointmentDate + ' ' + a.appointmentTime, "MM/DD/YYYY HH:mm:ss").subtract(1, 'second');
            const endDate = moment(a.appointmentDate + ' ' + a.appointmentTime, "MM/DD/YYYY HH:mm:ss").add(1, 'hour');
    
            return appointmentUpdated 
                && a.id != appointmentUpdated.id 
                && a.phoneNumber == appointmentUpdated.phoneNumber 
                && a.petId == appointmentUpdated.petId 
                && compareDate.isBetween(startDate, endDate);
        });
    
        if (appointmentByPhone) {
            resp.status(200);
            return resp.json({
                error: 'You already have an appointment booked for this pet'
            });
        }

        resp.status(200);
        return resp.json(appointmentUpdated);
    }
})

router.delete("/:id", (req, resp) => {
    if (req.params.id) {
        const appointment = appointmentList.find(a => a.id == req.params.id);
        if (appointment) {
            appointmentList = appointmentList.filter(a => a.id != req.params.id);
            resp.status(200);
            return resp.json({success: true});
        }

        resp.status(404);
        return resp.json({error: `Appointment with id:${req.params.id} not found.`});
    }
})

module.exports=router