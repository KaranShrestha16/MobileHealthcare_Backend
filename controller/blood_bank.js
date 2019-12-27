// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key';
const knex = require('knex');
const config = require('../knexfile');
const dbClient = knex(config);
let BLOOD_BANK_ID=0;

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
        const data = await dbClient('BLOOD_BANK').select();
        res.json(data);
    }
    catch(err){
        res.json(err)
    }
    
}

async function add(req, res){
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }

    const idIndex=await dbClient.table('BLOOD_BANK').select();
    BLOOD_BANK_ID=idIndex.length+1;

        const data= {
        BLOOD_BANK_ID: BLOOD_BANK_ID,
        NAME:req.body.NAME,
        ADDRESS:req.body.ADDRESS,
        CONTACT:req.body.CONTACT
        }

        console.log(data)


    try{
      const hh=   await dbClient('BLOOD_BANK').insert(data);
         console.log(hh)
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
    add
    
}