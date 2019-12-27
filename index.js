const Express = require('express');
const port = process.env.PORT || 8001;
const doctorRoutes = require('./routes/doctor');
const hospitalRoutes = require('./routes/hospital');
const patientRoutes = require('./routes/patient');
const ambulanceRoutes = require('./routes/ambulance');
const pharmacyRoutes = require('./routes/pharmacy');
const bloodbankRoutes = require('./routes/blood_bank');

const imageUpload = require('./routes/imageUpload')




const app = new Express();
const path = require('path');
app.use("/mobilehealthcare/v1",doctorRoutes);
app.use("/mobilehealthcare/v1",imageUpload);
app.use("/mobilehealthcare/v1",patientRoutes);
app.use("/mobilehealthcare/v1",hospitalRoutes);
app.use("/mobilehealthcare/v1",ambulanceRoutes);
app.use("/mobilehealthcare/v1",pharmacyRoutes);
app.use("/mobilehealthcare/v1",bloodbankRoutes);
app.use(Express.static(path.join(__dirname, './images')));

// Handeling routes Error
app.use((req, res, next) => {
    const error = new Error("URL not Found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port, function () {
    console.log("Listening on port: ", port);
});


