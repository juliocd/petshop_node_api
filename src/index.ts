const path = require('path');
const express = require('express');
const app = express();
require('dotenv').config();
const fs = require('fs');
const bodyParser = require("body-parser");
const cors = require("cors");

// Middleware to process JSON data (Express does not process JSON data by default, only text data)
// Only for Content-Type: application/json
app.use(bodyParser.json());
// To extend to other content Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// To extend to other content Content-Type: text/plain
app.use(bodyParser.text());

// For all domains
app.use(cors())

const filePath = path.join(__dirname, 'people.json');

import { IPet } from "./IPet";

let petList: IPet[] = [];

fs.readFile(filePath, (err, data: any) => {
    if (err) {
        console.error("Unable to open file : " + filePath);
    } else {
        petList = JSON.parse(data);
    }
})

// ### PETS ###

// Return all pets
app.get("/", (req, resp) => {
    resp.status(200);
    return resp.send('Petshop API is listening!');
});

// Return all pets
app.get("/pets", (req, resp) => {
    resp.status(200);
    return resp.json(petList);
});

// Return pet by id
app.get("/pets/:id", (req, resp) => {
    if (req.params.id) {
        const pet = petList.find(c => c.id == req.params.id);
        if (pet) {
            resp.status(200);
            return resp.json(pet);
        }

        resp.status(404);
        return resp.json({error: `Pet with id:${req.params.id} not found.`});
    }
})

// Add contact
app.post("/pets/", (req, resp) => {
    const {name, category, price} = req.body;

    if (!name) {
        resp.status(200);
        return resp.json({error: 'name is required.'})
    }

    if (!category) {
        resp.status(200);
        return resp.json({error: 'category is required.'})
    }

    if (!price) {
        resp.status(200);
        return resp.json({error: 'price is required.'})
    }

    const id = petList.length > 0 ? petList[petList.length - 1].id + 1 : 1;

    const pet:IPet = {
        id,
        name,
        category,
        price
    }

    petList.push(pet);

    resp.status(200);
    return resp.json(pet);
})

// Update pet by id
app.put("/pets/:id", (req, resp) => {
    if (req.params.id) {
        let petUpdated: IPet | null = null;

        for(let contact of petList) {
            if (contact.id == req.params.id) {
                const {name, category, price} = req.body;
        
                if (name) {
                    contact.name = name;
                }
                if (category) {
                    contact.category = category;
                }
                if (price) {
                    contact.price = price;
                }

                petUpdated = contact;
                break;
            }
        }

        if (!petUpdated) {
            resp.status(404);
            return resp.json({error: `Pet with id:${req.params.id} not found.`});
        }

        resp.status(200);
        return resp.json(petUpdated);
    }
})

// Delete pet by id
app.delete("/pets/:id", (req, resp) => {
    if (req.params.id) {
        const pet = petList.find(c => c.id == req.params.id);
        if (pet) {
            petList = petList.filter(c => c.id != req.params.id);
            resp.status(200);
            return resp.json({success: true});
        }

        resp.status(404);
        return resp.json({error: `Pet with id:${req.params.id} not found.`});
    }
})

// ############

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("App running in port " + port)
})