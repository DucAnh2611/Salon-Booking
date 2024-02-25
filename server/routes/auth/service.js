const configModel = require("../../models/config");
const { updateUser, newUser, insertUser } = require("../../models/user");
const { DatabasePG } = require("../../services/db");
const { sendEmail, generateOTP } = require("../../services/nodemailer");
const { RedisGetValue, RedisSetValue, RedisDelValue  } = require("../../services/redis");
const ResponseFormat = require("../../services/responseFormat");
const { caltime } = require("../../utils/time");

const jsonRes = new ResponseFormat();
const AUTH_CONFIG = {
    otp_expire: {
        time: 5,
        type: "m"
    }
}

async function login({email, password, type, ...props}, user) {
    
    jsonRes.resetState();
    const knex = await DatabasePG.getInstance().getKnex();

    try {
        await knex.transaction(async trx => {
            const getUserLogin = await trx
            .select('id', 'email', 'password', 'firstname', 'lastname', 'isonline')
            .from(configModel.table.users)
            .where("email", email)
            .first();

            if( getUserLogin ) {
                if( getUserLogin.password === password) {
                    await updateUser(trx, email, {
                        isonline: true,
                        updateat: new Date()
                    });

                    jsonRes
                    .ServerSuccess200()
                    .setMessage("Login Successful!")
                    .setBody({
                        email, 
                        id:getUserLogin.id
                    })                
                }
                else 
                    jsonRes
                    .setSuccess(false)
                    .setStatus(401)
                    .setMessage("Incorrect Password!");
            }
            else jsonRes = 
            await signup(newUser({
                email: email,
                password: password,
                user
            }))  
        });
    }
    catch(err) {
        console.log(err);
        jsonRes.ServerError500();
    }
    
    return jsonRes;
}

async function signup({email, birthday, roleid, firstname, lastname, password, ...props}) {
    jsonRes.resetState();
    const knex = await DatabasePG.getInstance().getKnex();
    try {
        await knex.transaction(async (trx) => {
                const userSignup = {
                    email, 
                    birthday, 
                    roleid, 
                    firstname, 
                    lastname, 
                    password,
                    ...props
                }

                try {
                    const insertedId = await insertUser(trx, userSignup, ['id']);
                    
                    if(insertedId) {
                        jsonRes
                        .setSuccess(true)
                        .setStatus(200)
                        .setBody({id: insertedId[0]['id'], email, firstname, lastname})
                        .setMessage("Signup Successful!");
                    }
                    else throw "Error on Server"
                }
                catch(err) {
                    console.log(err);

                    jsonRes
                        .setSuccess(false)
                        .setStatus(500)
                        .setBody()
                        .setMessage("Something wrong with server!");
                }          
        });        
    }
    catch(err) {
        jsonRes.ServerError500();
    }


    return jsonRes;
}

async function verifyEmailOTP(form) {
    jsonRes.resetState();
    try {
        const redisOTP = await RedisGetValue.getValue(`otp-session:${form.uid}`);
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
        res = await RedisDelValue.delKey(`otp-session:${form.uid}`);

        jsonRes
        .setSuccess(true)
        .setMessage("Verify Successfull!")
        .setStatus(200)
        .setBody({});
    }


    return jsonRes;
}

async function sendOTPEmail(form) {
    jsonRes.resetState();

    const {uid, email} = form;
    const otp = generateOTP();

    const optionNodemailer = {
        subject: '[SalonBooking]',
        html: `Your OTP code is: <b>${otp}</b>`
    }

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
        const setToSession = await RedisSetValue.setValue(
            `otp-session:${uid}`, 
            {
                email, 
                otp
            },
            caltime( AUTH_CONFIG.otp_expire.time, AUTH_CONFIG.otp_expire.type )
        );

        jsonRes
        .setSuccess(true)
        .setMessage(`OTP was sent to ${email}!`)
        .setStatus(200)
        .setBody({});
    }

    return jsonRes;
} 

module.exports = {login, signup, verifyEmailOTP, sendOTPEmail}