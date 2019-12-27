const Express = require('express');
const routes = Express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const patientController = require('../controller/patient');

routes.use(bodyParser.json());
routes.use(bodyParser.urlencoded({ extended: false }));
routes.use(cors.apply());
routes.get("/patient",patientController.getAll);
routes.get("/patient/:id",patientController.getByID);
routes.post("/patient/login",patientController.login);
routes.post("/admin/login",patientController.adminLogin);
routes.post("/patient/signup",patientController.addPatient);
routes.post("/patient/getappointment",patientController.getAppointment);
routes.get("/patient/getappointmenthistory/:id",patientController.getAppointmenthistory);
routes.get("/appointment",patientController.getAllAppointment);
routes.put("/patient/:id",patientController.updatePatient);
// routes.delete("/patient/:id",patientController.deletePatient);




module.exports = routes;
