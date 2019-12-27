
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key';
const knex = require('knex');
const config = require('../knexfile');
const dbClient = knex(config);

const tableName='HOSPITAL';
let HOSPITAL_ID=27;

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
       
        const data = await dbClient(tableName).select();
        res.json(data);

    }
    catch(err){
        res.json(err)
    }
    
}

async function addHospital(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    const idIndes=await dbClient.table(tableName).select();
    HOSPITAL_ID=idIndes.length+1;

    const data={
        HOSPITAL_ID: HOSPITAL_ID,
        HOSPITAL_NAME:req.body.HOSPITAL_NAME ,
        ADDRESS: req.body.ADDRESS ,
        IMAGE: req.body.IMAGE ,
        CONTACT: req.body.CONTACT,
        WEBSITE: req.body.WEBSITE,
        GENERAL:req.body.GENERAL,
        ICU: req.body.ICU,
        EMERGENCY: req.body.EMERGENCY
    }

    console.log(data);
    try{
        const result = await dbClient(tableName).insert(data);
        res.json({
            status:true,
            message:"Insert Successful"
        });
        HOSPITAL_ID=HOSPITAL_ID+1;

    }
    catch(err){
        res.json(err);
        console.log(err);
    }
    
}



async function getById(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    try{
        const result = await dbClient(tableName).select().where({'HOSPITAL_ID':req.params.id});
        const data={
            HOSPITAL_ID: result[0].HOSPITAL_ID,
            HOSPITAL_NAME: result[0].HOSPITAL_NAME ,
            ADDRESS: result[0].ADDRESS ,
            IMAGE: result[0].IMAGE ,
            CONTACT: result[0].CONTACT,
            WEBSITE: result[0].WEBSITE,
            GENERAL: result[0].GENERAL,
            ICU: result[0].ICU,
            EMERGENCY: result[0].EMERGENCY,
        }
        res.json(data);
    }
    catch(err){
        res.json(err)
    }
    
}

async function getAllDoctors(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    try{
        const result = await dbClient('HOSPITAL AS H' ).select().innerJoin('DOCTOR_HOSPITAL AS DH','H.HOSPITAL_ID', 'DH.HOSPITAL_ID').
        innerJoin('DOCTOR AS D','D.DOCTOR_ID', 'DH.DOCTOR_ID').
        where({'H.HOSPITAL_ID':req.params.id});
    
        res.json(result);

    
    }
    catch(err){
        res.json(err)
    }
    
}

async function getAllDoctorsWithDepartment(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    console.log(req.headers.department);
    
    console.log(req.headers.authorization);


    try{
        const result = await dbClient('HOSPITAL AS H' ).select()
        .innerJoin('DOCTOR_HOSPITAL AS DH','H.HOSPITAL_ID', 'DH.HOSPITAL_ID')
        .innerJoin('DOCTOR AS D','D.DOCTOR_ID', 'DH.DOCTOR_ID').
        where({'H.HOSPITAL_ID':req.params.id}).
        where({'DH.DEPARTMENT':req.headers.department});
    
        res.json(result);

        console.log(result);
    }
    catch(err){
        res.json(err)
    }
    
}

module.exports={

    getAll,
    getById,
    getAllDoctors,
    getAllDoctorsWithDepartment,
    addHospital
    
    
}