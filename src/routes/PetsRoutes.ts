const fs = require('fs');
const path = require('path');

import { IPet } from "../models/IPet";

// Importing the module 
const express=require("express") 
  
// Creating express Router 
const router=express.Router()

const filePath = path.join(`${__dirname}/../data/`, 'pets.json');
let petList: IPet[] = [];

fs.readFile(filePath, (err, data: any) => {
    if (err) {
        console.error("Unable to open file : " + filePath);
    } else {
        petList = JSON.parse(data);
    }
})
  
// Return all pets
router.get("/", (req, resp) => {
    let result = petList;

    if (req.query.category) {
        result = result.filter(record => record.category == req.query.category);
    }

    if (req.query.breed) {
        result = result.filter(record => record.breed.toLowerCase().match(req.query.breed.toLowerCase()));
    }

    resp.status(200);
    return resp.json(result);
});

// Return pet by id
router.get("/:id", (req, resp) => {
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
router.post("/", (req, resp) => {
    const {breed, category, price, image, height, isLongMeasure, weight, color,
        lifeExpectancy, shortDescription, description} = req.body;

    if (!breed) {
        resp.status(200);
        return resp.json({error: 'breed is required.'})
    }

    if (!category) {
        resp.status(200);
        return resp.json({error: 'category is required.'})
    }

    if (!price) {
        resp.status(200);
        return resp.json({error: 'price is required.'})
    }

    if (isNaN(price)) {
        resp.status(200);
        return resp.json({error: 'price must be a number.'})
    }

    if (height && isNaN(height)) {
        resp.status(200);
        return resp.json({error: 'height must be a number'})
    }

    if (weight && isNaN(weight)) {
        resp.status(200);
        return resp.json({error: 'weight must be a number'})
    }

    if (lifeExpectancy && isNaN(lifeExpectancy)) {
        resp.status(200);
        return resp.json({error: 'lifeExpectancy must be a number'})
    }

    const id = petList.length > 0 ? petList[petList.length - 1].id + 1 : 1;

    const pet:IPet = {
        id,
        breed,
        category,
        price,
        image, 
        height, 
        isLongMeasure,
        weight, 
        color,
        lifeExpectancy, 
        shortDescription, 
        description
    }

    petList.push(pet);

    resp.status(200);
    return resp.json(pet);
})

// Update pet by id
router.put("/:id", (req, resp) => {
    if (req.params.id) {
        let petUpdated: IPet | null = null;

        for(let pet of petList) {
            if (pet.id == req.params.id) {
                const {breed, category, price, image, height, isLongMeasure, weight, color,
                    lifeExpectancy, shortDescription, description} = req.body;
        
                if (breed) {
                    pet.breed = breed;
                }
                if (category) {
                    pet.category = category;
                }
                if (price) {
                    if (isNaN(price)) {
                        resp.status(200);
                        return resp.json({error: 'price must be a number.'})
                    }

                    pet.price = price;
                }
                if (image) {
                    pet.image = image;
                }
                if (height) {
                    if (isNaN(height)) {
                        resp.status(200);
                        return resp.json({error: 'height must be a number.'})
                    }
                    pet.height = height;
                }
                if (isLongMeasure) {
                    pet.isLongMeasure = isLongMeasure;
                }
                if (color) {
                    pet.color = color;
                }
                if (weight) {
                    if (isNaN(weight)) {
                        resp.status(200);
                        return resp.json({error: 'weight must be a number.'})
                    }
                    pet.weight = weight;
                }
                if (lifeExpectancy) {
                    if (isNaN(lifeExpectancy)) {
                        resp.status(200);
                        return resp.json({error: 'lifeExpectancy must be a number.'})
                    }
                    pet.lifeExpectancy = lifeExpectancy;
                }
                if (shortDescription) {
                    pet.shortDescription = shortDescription;
                }
                if (description) {
                    pet.description = description;
                }

                petUpdated = pet;
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
router.delete("/:id", (req, resp) => {
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

module.exports=router