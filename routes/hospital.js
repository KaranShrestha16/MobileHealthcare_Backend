const Express = require('express');
const routes = Express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const hospitalController = require('../controller/hospital')
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(cors.apply());
routes.get("/hospital/getAll",hospitalController.getAll);
routes.post("/hospital/add",hospitalController.addHospital);
routes.get("/hospital/:id",hospitalController.getById);
routes.get("/hospital/getAllDoctors/:id",hospitalController.getAllDoctors);
routes.get("/hospital/getAllDoctorsWithDepartment/:id",hospitalController.getAllDoctorsWithDepartment);





module.exports = routes;
