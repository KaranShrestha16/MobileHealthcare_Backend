const Express = require('express');
const routes = Express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const ambulanceController = require('../controller/ambulance')
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(cors.apply());
routes.get("/ambulance/getAll",ambulanceController.getAll);
routes.post("/ambulance/add",ambulanceController.addAmbulance);




module.exports = routes;
