const { InsertService, UpdateServer } = require("../services/db");
const { generateOTP, sendEmail } = require("../services/nodemailer");
const Redis = require("../services/redis");
const ResponseFormat = require("../services/responseFormat");
const configModel = require("./config");
const jsonRes = new ResponseFormat();

const RoleId = {
    "EMPLOYEE": 1,
    "CLIENT": 2
}

const newUser = ({email, password, googleInfo}) => {
            
    const date = new Date();

    return {
        email: email,
        firstname: googleInfo.given_name,
        lastname: googleInfo.family_name,
        birthday: googleInfo.birthday || "01/01/1900",
        roleid: RoleId[googleInfo.roleId || 1],
        password: password,
        gender: "",
        lastlogin: date,
        createat: date,
        updateat: date,
        isonline: false
    }
}

async function insertUser(trx, data, returning) {

    jsonRes.resetState();

    const insert = await trx
    .insert(data, returning)
    .into(configModel.table.users)

    return jsonRes;
}

async function updateUser(trx, email, updates) {
    jsonRes.resetState();
    const update = 
    await trx(configModel.table.users)
        .update(updates)
        .where("email", "=", email)

    return jsonRes
        .ServerSuccess200()  
        .setMessage("Update user successful!")
        .setBody(updates);  

}

module.exports = {newUser, insertUser, updateUser}