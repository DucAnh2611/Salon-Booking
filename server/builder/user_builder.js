const User = require("../models/user");

class UserBuilder extends Builder {

    constructor() {
        this.name = "";
        this.email = "";
        this.password = "";
        this.birthday = "";
        this.type = "";
        this.firstname = "";
        this.lastname = "";
        this.gender = "";
        this.lastlogin = "";
        this.updateat = "";
        this.roleid = 0;
        this.id = 0;
    }

    setName(name) {
        this.name = name;
        return this; 
    }

    setEmail(email) {
        this.email = email;
        return this;
    }

    setPassword(pass) {
        this.password = pass;
        return this;
    }

    setBirthday(birthday) {
        this.birthday = birthday;
        return this;
    }

    setType(type) {
        this.type = type;
        return this;
    }

    setName(firstname = "", lastname = "") {
        this.firstname = firstname;
        this.lastname = lastname;
        return this;
    }

    setGender(gender) {
        this.gender = gender;
        return this;
    }

    setLastLogin(lastlogin) {
        this.lastlogin = lastlogin;
        return this;
    }

    setUpdateat(updateat) {
        this.updateat = updateat;
        return this;
    }

    setRoleid(roleid) {
        this.roleid = roleid;
        return this;
    }

    setId(id) {
        this.id = id;
        return this;
    }

    build() {
        return new User(this);
    }
}