
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_key';
const knex = require('knex');
const config = require('../knexfile');
const dbClient = knex(config);
const tableName='DOCTOR';
let doctor_id=0;
let doctor_hospital_id=0;
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


async function getAllDoctors(req, res){

    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    try{
        const data = await dbClient("DOCTOR").select();
        res.json(data);
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
}

async function addDoctor(req, res) { 
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    const idIndes=await dbClient.table(tableName).select();
    doctor_id=idIndes.length+1;    

    const data={
        DOCTOR_ID: doctor_id,
        DOCTOR_NAME:req.body.DOCTOR_NAME,
        DOCTOR_ADDRESS: req.body.DOCTOR_ADDRESS,
        DOCTOR_CONTACT:req.body.DOCTOR_CONTACT,
        GENDER: req.body.GENDER,
        QUALIFICATION: req.body.QUALIFICATION,
        DOCTOR_IMAGE: req.body.DOCTOR_IMAGE
       }

       console.log(data)


   
        try {
            await dbClient.table(tableName).insert(data);
         res.json({
            DOCTOR_ID:doctor_id
         });  
      
    }catch(error){
        console.log(error);
        res.json({
            status: false,
            message: "Doctor name already exit"
        })
    }

}

async function getDoctorById(req, res) { 

    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;
    }
    
    try{
        const result = await dbClient(tableName).select().where({'DOCTOR_ID':req.params.id});
       const data={
        DOCTOR_ID: doctor_id,
        DOCTOR_NAME:result[0].DOCTOR_NAME,
        DOCTOR_ADDRESS: result[0].DOCTOR_ADDRESS,
        DOCTOR_CONTACT:result[0].DOCTOR_CONTACT,
        GENDER: result[0].GENDER,
        QUALIFICATION: result[0].QUALIFICATION,
        DOCTOR_IMAGE: result[0].DOCTOR_IMAGE
       }

        res.json(data);
    }
    catch(err){
        console.log(err)
        res.json(err)
    }
    
    
}


async function getAllDoctorsWithHospital(req, res){
    
    try{
        const result = await dbClient('DOCTOR AS D' ).select()
        .innerJoin('DOCTOR_HOSPITAL AS DH','D.DOCTOR_ID', 'DH.DOCTOR_ID')
        .innerJoin('HOSPITAL AS H','H.HOSPITAL_ID', 'DH.HOSPITAL_ID').
        where({'D.DOCTOR_ID':req.params.id});
        res.json(result);
    }
    catch(err){
        res.json(err)
    }
    
}

async function addDoctor_Hospital(req, res) { 
    if (authenticate(req.headers.authorization) === false) {
        notAuthenticated(res);
        return;

    }

    const idIndes=await dbClient.table('DOCTOR_HOSPITAL').select();
        doctor_hospital_id =idIndes.length+1;

    const data={
        DOCTOR_HOSPITAL_ID: doctor_hospital_id,
        DOCTOR_ID: req.body.DOCTOR_ID,
        DEPARTMENT:req.body.DEPARTMENT,
        HOSPITAL_ID: req.body.HOSPITAL_ID
      
    };

    console.log(data);
    
        try {
            await dbClient.table('DOCTOR_HOSPITAL').insert(data);
            res.json({
                status: true,
                message: "Doctor hospital added Successful"
            })
            
        } catch (error) {
            console.log(error)
            res.json({
                status: false,
                message: error
            })
        }

    


}

async function deleteDoctor(req, res) { 
     res.json("Select * from doctor where doctor_id=1");
}
async function updateDoctor(req, res) { 
    res.json("Select * from doctor where doctor_id=1");
}


module.exports = {
    getAllDoctors,
    addDoctor,
    getDoctorById,
    getAllDoctorsWithHospital,
    addDoctor_Hospital

    }