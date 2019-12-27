const Express = require('express');
const routes = Express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const doctorController = require('../controller/doctor')
routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(cors.apply());
routes.get("/doctor/getAll",doctorController.getAllDoctors);
routes.get("/doctor/:id",doctorController.getDoctorById);
routes.post("/doctor/register",doctorController.addDoctor);
routes.post("/doctor/addDoctor_Hospital",doctorController.addDoctor_Hospital);
routes.get("/doctor/getAllDoctorsWithHospital/:id",doctorController.getAllDoctorsWithHospital);





module.exports = routes;
