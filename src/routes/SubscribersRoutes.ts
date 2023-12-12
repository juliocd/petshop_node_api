const fs = require('fs');
const path = require('path');

import { isValidEmail } from "../helpers/utils";
import { ISubscriber } from "../models/ISubscriber";

// Importing the module 
const express=require("express") 
  
// Creating express Router 
const router=express.Router()

let subscriberList: ISubscriber[] = [];

router.get("/", (req, resp) => {
    resp.status(200);
    return resp.json(subscriberList);
});

// Add subscriber
router.post("/", (req, resp) => {
    const {name, email} = req.body;

    if (!name) {
        resp.status(200);
        return resp.json({error: 'firstName is required.'})
    }

    if (!email) {
        resp.status(200);
        return resp.json({error: 'lastName is required.'})
    }

    if (!isValidEmail(email)) {
        resp.status(200);
        return resp.json({error: 'Email is invalid.'})
    }

    if (subscriberList.find(subscriber => subscriber.email === email)) {
        resp.status(200);
        return resp.json({error: 'Email already exist.'})
    }

    const id = subscriberList.length > 0 ? subscriberList[subscriberList.length - 1].id + 1 : 1;

    const subscriber:ISubscriber = {
        id,
        name,
        email
    }

    subscriberList.push(subscriber);

    resp.status(200);
    return resp.json(subscriber);
})


module.exports=router