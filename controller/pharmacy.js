// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key';
const knex = require('knex');
const config = require('../knexfile');
const dbClient = knex(config);

let report_id=0;
let PHARMACY_ID=0;

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
        const data = await dbClient('PHARMACY').select();
        res.json(data);
    }
    catch(err){
        res.json(err)
    }
    
}

async function addReport(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    const idIndex=await dbClient.table('REPORT').select();
    report_id=idIndex.length+1;
    
   
        const data= {
        REPORT_ID: report_id,
        REPORT_NAME:req.body.REPORT_NAME,
        REPORT_IMAGE:req.body.REPORT_IMAGE,
        REPORT_DATE:req.body.REPORT_DATE,
        DESCRIPTION:req.body.DESCRIPTION,
        PATIENT_ID:req.body.PATIENT_ID
        }


    try{
         await dbClient('REPORT').insert(data);
         res.json({
            status: true,
            message: 'Insert Sucessful'
        });

        report_id=report_id+1;
    }
    catch(err){
        res.json(err)
    }
    
}

async function addPharmacy(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    const idIndex=await dbClient.table('PHARMACY').select();
    PHARMACY_ID=idIndex.length+1;
        const data= {
        PHARMACY_ID: PHARMACY_ID,
        NAME:req.body.NAME,
        ADDRESS:req.body.ADDRESS,
        CONTACT:req.body.CONTACT,
        WEBSITE:req.body.WEBSITE
        }


    try{
         await dbClient('PHARMACY').insert(data);
         res.json({
            status: true,
            message: 'Insert Sucessful'
        });
    }
    catch(err){
        res.json(err)
    }
    
}

async function getAllReportById(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    try{
        const result = await dbClient('REPORT').select()
        .where({'PATIENT_ID':req.params.id});
        res.json(result);

       
    }
    catch(err){
        res.json(err)
    }
    
}




module.exports={

    getAll,
    addPharmacy,
    getAllReportById,
    addReport
    
}