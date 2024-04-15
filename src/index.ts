const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");

import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	message: "Too Many requests"
})

app.use(limiter);

// Import routes
const petsRoutes = require("./routes/PetsRoutes") 
const appointmentsRoutes = require("./routes/AppointmentsRoutes") 
const subscribersRoutes = require("./routes/SubscribersRoutes") 
const merchandiseRoutes = require("./routes/MerchandiseRoutes") 

// Middleware to process JSON data (Express does not process JSON data by default, only text data)
// Only for Content-Type: application/json
app.use(bodyParser.json());
// To extend to other content Content-Type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
// To extend to other content Content-Type: text/plain
app.use(bodyParser.text());

// For all domains
app.use(cors())

// Return all pets
app.get("/", (req, resp) => {
    resp.status(200);
    return resp.send('Petshop API is listening!');
});

app.use("/pets", petsRoutes) 
app.use("/appointments", appointmentsRoutes) 
app.use("/subscribers", subscribersRoutes) 
app.use("/merchandise", merchandiseRoutes) 

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("App running in port " + port)
})