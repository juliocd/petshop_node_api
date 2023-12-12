const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes
const petsRoutes = require("./routes/PetsRoutes") 
const appointmentsRoutes = require("./routes/AppointmentsRoutes") 
const subscribersRoutes = require("./routes/SubscribersRoutes") 

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("App running in port " + port)
})