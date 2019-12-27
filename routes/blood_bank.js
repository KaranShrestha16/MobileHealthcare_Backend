
const Express = require('express');
const routes = Express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const blood_bankController = require('../controller/blood_bank')
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(cors.apply());
routes.get("/bloodbank/getAll",blood_bankController.getAll);
routes.post("/bloodbank/add",blood_bankController.add);



module.exports = routes;
