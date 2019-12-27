// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key';
const knex = require('knex');
const config = require('../knexfile');
const dbClient = knex(config);

let AMBULANCE_ID=0;

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
        const data = await dbClient('AMBULANCE').select();
        res.json(data);
    }
    catch(err){
        res.json(err)
    }
    
}

async function addAmbulance(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    const idIndex=await dbClient.table('AMBULANCE').select();
    AMBULANCE_ID=idIndex.length+1;

    
        const data= {
        AMBULANCE_ID:AMBULANCE_ID,
        NAME:req.body.NAME,
        ADDRESS:req.body.ADDRESS,
        CONTACT:req.body.CONTACT
        }


    try{
         await dbClient('AMBULANCE').insert(data);
         res.json({
            status: true,
            message: 'Insert Sucessful'
        });
    }
    catch(err){
        res.json(err)
    }
    
}




module.exports={

    getAll,
    addAmbulance
    
}