class User {

    constructor(builder) {
        this.name = builder.name;
        this.email = builder.email;
        this.password = builder.password;
        this.birthday = builder.birthday;
        this.type = builder.type;
        this.firstname = builder.firstname;
        this.lastname = builder.lastname;
        this.gender = builder.gender;
        this.lastlogin = builder.lastlogin;
        this.updateat = builder.updateat;
        this.roleid = builder.roleid;
        this.id = builder.id;
    }

}

module.exports = User