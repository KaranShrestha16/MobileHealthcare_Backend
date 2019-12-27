const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key';
const knex = require('knex');
const config = require('../knexfile');
const dbClient = knex(config);
const tableName='PATIENT';
let patient_id=0;
let appointment_id=0;


function notAuthenticated(res) {
    res.json({
        status: 'fail',
        message: 'You are not authenticate user',
        code: 404
    });
}

function authenticate(token) { //token -> 123123789127389213
    if (!token) {
        return false;
    }
    try {
        const payload = jwt.verify(token, SECRET_KEY);
        return true;
        // use payload if required
    } catch (error) {
        console.log(error)
        return false
    }

}


async function getAll(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    try{
        const data = await dbClient('PATIENT').select();
        res.json(data);
    }
    catch(err){
        res.json(err)
    }
    
}

async function getAllAppointment(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    try{
        const result = await dbClient('PATIENT').select();
        res.json(result);
    }
    catch(err){
        res.json(err)
    }
    
}

async function getByID(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    try{
        const result = await dbClient(tableName).select().where({'PATIENT_ID':req.params.id});

        const data={
            PATIENT_ID: result[0].PATIENT_ID,
            NAME: result[0].NAME ,
            BIRTHDATE: result[0].BIRTHDATE ,
            GENDER: result[0].GENDER ,
            BLOOD_GROUP:result[0].BLOOD_GROUP,
            ADDRESS: result[0].ADDRESS,
            CONTACT: result[0].CONTACT,
            EMAIL: result[0].EMAIL,
            PASSWORD: result[0].PASSWORD,
            IMAGE: result[0].IMAGE
    
        }
        res.json(data);
    }
    catch(err){
        res.json(err)
    }
    
}

async function addPatient(req, res){
    const password = req.body.PASSWORD;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const idIndes=await dbClient.table(tableName).select();
    patient_id=idIndes.length+1;

    console.log(patient_id)


    const data = {
        PATIENT_ID:patient_id,
        NAME: req.body.NAME,
        EMAIL: req.body.EMAIL,
        CONTACT: req.body.CONTACT,
        ADDRESS: req.body.ADDRESS,
        IMAGE: req.body.IMAGE,
        BLOOD_GROUP: req.body.BLOOD_GROUP,
        PASSWORD:hashedPassword,
        BIRTHDATE:req.body.BIRTHDATE,
        GENDER:req.body.GENDER
    };

    try{
        const result = await dbClient.table(tableName).select().where({ 'EMAIL':req.body.EMAIL});

        if(result.length!=0){
            res.json({
                status: false,
                message: 'Email already exit'
            })
        }else{

            try {
                await dbClient.table(tableName).insert(data);
        
                res.json({
                    status: true,
                    message: 'Paitent register success'
                });
                patient_id=patient_id+1;
                console.log(patient_id);
        
            } catch (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: 'Fail to register Paitent'
                })
            
            }


        }

    }catch(error){
        console.log(error);
        res.json({
            status: false,
            message: 'Fail to register Patient'
        })
    }

}

async function getAppointment(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    

    const data = {
        APPOINTMENT_ID:appointment_id,
        DOCTOR_ID: req.body.PATIENT_ID,
        PATIENT_ID: req.body.PATIENT_ID,
        HOSPITAL_ID: req.body.HOSPITAL_ID,
        CURRENT_SYMPTOMS: req.body.CURRENT_SYMPTOMS,
        APPOINTMENT_DATE: req.body.APPOINTMENT_DATE
    };

    const idIndes=await dbClient.table('APPOINTMENT').select();
    appointment_id=idIndes.length+1;


    

    try{
        await dbClient.table('APPOINTMENT').insert(data);
        res.json({
            status: true,
            message: 'Successfully Get Appointment'
        })

        appointment_id=appointment_id+1;

            } catch (error) {
                console.log(error);
                res.json({
                    status: false,
                    message: 'Fail to get appointment'
                })
            
            }


}

async function login(req,res){
    const email = req.body.email;
    const password = req.body.password;
    try{
    const result = await dbClient.table(tableName).select().where({ 'EMAIL':email});
    if(result.length!=0){
        const passwordFromDB = result[0].PASSWORD;
        const id = result[0].PATIENT_ID;
        console.log(id);
        const isMatchPassword = bcrypt.compareSync(password, passwordFromDB);
        if (isMatchPassword) {
            res.json({
                status: true,
                accessToken: jwt.sign({ patientEmail: req.body.email }, SECRET_KEY),
                message: 'Login Sucess',
                id:id
            })
        } else {

            res.json({
                status: false,
                message: 'Password do not match'
            })
        }
    }else{
        res.json({
            status: false,
            message: 'Email do not match'
        })
    }
      
    }catch(error){
        console.log(error);
        res.json({
            status: false,
            message: "Email donot match"
        })
    }


}

async function adminLogin(req,res){
    const email = req.body.email;
    const password = req.body.password;
console.log(email)
    try{
    const result = await dbClient.table('ADMINN').select().where({ 'EMAIL':email});
    const id = result[0].ADMIN_ID;
    if(result.length!=0){
        if (password=='Admin@123') {
            res.json({
                    status: true,
                    accessToken: jwt.sign({ patientEmail: req.body.email }, SECRET_KEY),
                    message: 'Login Sucess',
                    id:id
            })
        } else {

            res.json({
                status: false,
                message: 'Password do not match'
            })
        }
    }else{
        res.json({
            status: false,
            message: 'Email do not match'
        })
    }
      
    }catch(error){
        console.log(error);
        res.json({
            status: false,
            message: "Email donot match"
        })
    }


}

async function updatePatient(req,res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    const data = {
        NAME: req.body.NAME,
        EMAIL: req.body.EMAIL,
        CONTACT: req.body.CONTACT,
        ADDRESS: req.body.ADDRESS,
        IMAGE: req.body.IMAGE,
        BLOOD_GROUP: req.body.BLOOD_GROUP,
        PASSWORD:req.body.PASSWORD,
        BIRTHDATE:req.body.BIRTHDATE,
        GENDER:req.body.GENDER
    };

    console.log(data)

    try {
        const result= await dbClient(tableName).where('PATIENT_ID', req.params.id).update(data);;
                if(result!=0){
                    res.json({
                        status: true,
                        message: 'Update Patient details'
                    })
                }
        
    } catch (error) {
            console.log(error);
            res.json({
                status: false,
                message: 'Patient id not found'
            })
        }
        
    
}


async function getAppointmenthistory(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    try{
        const result = await dbClient('PATIENT AS P' ).select('D.DOCTOR_NAME','D.QUALIFICATION','H.HOSPITAL_NAME','H.IMAGE','A.APPOINTMENT_DATE','A.CURRENT_SYMPTOMS')
        .innerJoin('APPOINTMENT AS A','P.PATIENT_ID', 'A.PATIENT_ID')
        .innerJoin('DOCTOR AS D','D.DOCTOR_ID', 'A.DOCTOR_ID')
        .innerJoin('HOSPITAL AS H','H.HOSPITAL_ID', 'A.HOSPITAL_ID')
        .where({'P.PATIENT_ID':req.params.id});
        res.json(result);

    
    }
    catch(err){
        res.json(err)
    }
    
}



module.exports={
    getAll,
    addPatient,
    login,
    getByID,
    updatePatient,
    adminLogin,
    getAppointment,
    getAllAppointment,
    getAppointmenthistory

}