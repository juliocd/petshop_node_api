const fs = require('fs');
const path = require('path');

import { IMerchandiseItem } from "../models/IMerchandiseItem";

// Importing the module 
const express=require("express") 
  
// Creating express Router 
const router=express.Router()

const filePath = path.join(`${__dirname}/../data/`, 'merchandise.json');
let merchandiseList: IMerchandiseItem[] = [];

fs.readFile(filePath, (err, data: any) => {
    if (err) {
        console.error("Unable to open file : " + filePath);
    } else {
        merchandiseList = JSON.parse(data);
    }
})
  
router.get("/", (req, resp) => {
    let result = merchandiseList;

    if (req.query.category) {
        result = result.filter(record => record.category == req.query.category);
    }

    if (req.query.petCategory) {
        result = result.filter(record => record.petCategory == req.query.petCategory);
    }

    if (req.query.name) {
        result = result.filter(record => record.name.toLowerCase().match(req.query.name.toLowerCase()));
    }

    resp.status(200);
    return resp.json(result);
});

router.get("/:id", (req, resp) => {
    if (req.params.id) {
        const merchandiseItem = merchandiseList.find(c => c.id == req.params.id);
        if (merchandiseItem) {
            resp.status(200);
            return resp.json(merchandiseItem);
        }

        resp.status(404);
        return resp.json({error: `Merchandise item with id:${req.params.id} not found.`});
    }
})

router.post("/", (req, resp) => {
    const {name, image, desciption, price, category, petCategory} = req.body;

    if (!name) {
        resp.status(200);
        return resp.json({error: 'name is required.'})
    }

    if (!image) {
        resp.status(200);
        return resp.json({error: 'image is required.'})
    }

    if (!desciption) {
        resp.status(200);
        return resp.json({error: 'desciption is required.'})
    }

    if (isNaN(price)) {
        resp.status(200);
        return resp.json({error: 'price must be a number.'})
    }

    if (!category) {
        resp.status(200);
        return resp.json({error: 'category is required'})
    }

    if (!petCategory) {
        resp.status(200);
        return resp.json({error: 'Pet category is required'})
    }

    const id = merchandiseList.length > 0 ? merchandiseList[merchandiseList.length - 1].id + 1 : 1;

    const merchandiseItem:IMerchandiseItem = {
        id,
        category,
        price,
        image,
        name,
        desciption,
        petCategory
    }

    merchandiseList.push(merchandiseItem);

    resp.status(200);
    return resp.json(merchandiseItem);
})

router.put("/:id", (req, resp) => {
    if (req.params.id) {
        let merchandiseItemUpdated: IMerchandiseItem | null = null;

        for(let merchandiseItem of merchandiseList) {
            if (merchandiseItem.id == req.params.id) {
                const {name, image, desciption, price, category, petCategory} = req.body;
        
                if (name) {
                    merchandiseItem.name = name;
                }

                if (category) {
                    merchandiseItem.category = category;
                }

                if (petCategory) {
                    merchandiseItem.petCategory = petCategory;
                }

                if (price) {
                    if (isNaN(price)) {
                        resp.status(200);
                        return resp.json({error: 'price must be a number.'})
                    }

                    merchandiseItem.price = price;
                }

                if (image) {
                    merchandiseItem.image = image;
                }
                
                if (desciption) {
                    merchandiseItem.desciption = desciption;
                }

                merchandiseItemUpdated = merchandiseItem;
                break;
            }
        }

        if (!merchandiseItemUpdated) {
            resp.status(404);
            return resp.json({error: `Merchandise item with id:${req.params.id} not found.`});
        }

        resp.status(200);
        return resp.json(merchandiseItemUpdated);
    }
})

router.delete("/:id", (req, resp) => {
    if (req.params.id) {
        const merchandiseItem = merchandiseList.find(c => c.id == req.params.id);
        if (merchandiseItem) {
            merchandiseList = merchandiseList.filter(c => c.id != req.params.id);
            resp.status(200);
            return resp.json({success: true});
        }

        resp.status(404);
        return resp.json({error: `Merchandise item with id:${req.params.id} not found.`});
    }
})

module.exports=router