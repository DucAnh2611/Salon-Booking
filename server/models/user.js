const DatabasePG = require("../services/db");
const { generateOTP, sendEmail } = require("../services/nodemailer");
const Redis = require("../services/redis");
const ResponseFormat = require("../services/responseFormat");
const configModel = require("./config");

async function login({email, password, ...props}) {
    
    const jsonRes = new ResponseFormat();
    const knex = await DatabasePG.getInstance().getKnex();
    
    const getUserLogin = await knex
        .select('email', 'password')
        .from(configModel.table.users)
        .where("email", email)
        .first();

    if(getUserLogin ) {
        if( getUserLogin.password === password)
            jsonRes
            .setSuccess(true)
            .setStatus(200)
            .setMessage("Login Successful!");
        else 
            jsonRes
            .setSuccess(false)
            .setStatus(300)
            .setMessage("Incorrect Password!");
    }
    else {
        jsonRes
        .setSuccess(false)
        .setStatus(404)
        .setMessage(`User ${email} is not exists!`)
    }
    
    return jsonRes;
}

async function signup({email, birthday, roleid, firstname, lastname, password, ...props}) {
    const jsonRes = new ResponseFormat();

    const knex = await DatabasePG.getInstance().getKnex();
    const existed = await knex
        .select('email', email)
        .count('email', {as: 'countEmail'})
        .from(configModel.table.users)
        .first();
    
    if(!existed.countEmail) {
        const userSignup = {
            email, 
            birthday, 
            roleid, 
            firstname, 
            lastname, 
            password
        }
        try {
            const insertedId = await knex
            .insert(userSignup, ['id'])
            .into(configModel.table.users);    
            
            if(insertedId) {
                jsonRes
                .setSuccess(true)
                .setStatus(200)
                .setBody({id: insertedId, email, birthday})
                .setMessage("Signup Successful!");
            }
            else {
                jsonRes
                .setSuccess(false)
                .setStatus(500)
                .setBody()
                .setMessage("Something wrong with server!");
            }
        }
        catch(err) {
            console.log(err);

            jsonRes
            .setSuccess(false)
            .setStatus(500)
            .setBody()
            .setMessage("Something wrong with server!");
        }
    }
    else {
        jsonRes
        .setSuccess(false)
        .setStatus(300)
        .setBody()
        .setMessage(`Email ${email} is existed!`);
    }

    return jsonRes;
}

async function verifyEmailOTP(form) {
    const jsonRes = new ResponseFormat();
    const client = Redis.getInstance().getClient();
    try {
        const redisOTP = await client.hGetAll(`otp-session:${form.uid}`);
        if(!redisOTP) {
            jsonRes
            .setSuccess(false)
            .setStatus(300)
            .setMessage(`OTP code is expire!`)
            .setBody();

            return jsonRes;
        }
        let err = []

        Object.entries(redisOTP).forEach((element) => {
            if(element[1] !== form[element[0]]) {
                err.push({
                    err:  element[0],
                    value: form[element[0]],
                    message: `Invalid!`
                })
            }
        });

        if(err.length !== 0) {
            jsonRes
            .setSuccess(false)
            .setStatus(300)
            .setMessage(`Invalid email for this !`)
            .setBody({err: err});
        }
    }
    catch(err) {
        console.log(err);
        jsonRes
        .setSuccess(false)
        .setStatus(500)
        .setMessage(`Something wrong on server!`)
        .setBody({err: err});
    }
    finally {
        res = await client.del(`otp-session:${form.uid}`);

        jsonRes
        .setSuccess(true)
        .setMessage("Verify Successfull!")
        .setStatus(200)
        .setBody({});
    }


    return jsonRes;
}

async function sendOTPEmail(form) {
    const jsonRes = new ResponseFormat();

    const {uid, email} = form;
    const otp = generateOTP();

    const optionNodemailer = {
        subject: '[SalonBooking]',
        html: `Your OTP code is: <b>${otp}</b>`
    }
    const client = Redis.getInstance().getClient();

    try {
        await sendEmail([email], optionNodemailer).then((err, res) => {
            if(err) {
                throw err;
            }
            console.log(res);
        });
    }
    catch(err) {
        console.log(err);

        jsonRes
        .setSuccess(true)
        .setMessage(`Something wrong on server!`)
        .setStatus(500)
        .setBody({});
    }
    finally {
        const setToSession = await client.hSet(`otp-session:${uid}`, {
            email, 
            otp
        }, {EX: time*60});

        jsonRes
        .setSuccess(true)
        .setMessage(`OTP was sent to ${email}!`)
        .setStatus(200)
        .setBody({});
    }

    return jsonRes;
} 

module.exports = {login, signup, verifyEmailOTP, sendOTPEmail}