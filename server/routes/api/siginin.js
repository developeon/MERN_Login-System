const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
module.exports = (app) => {
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const {
            firstName,
            lastName,
            password
        } = body;
        let {
            email
        } = body;

        if(!firstName){
            return res.send({
                success : false,
                message : 'Error: FirstName cannot be blank'
            });
        }
        if(!lastName){
            return res.send({
                success : false,
                message : 'Error: LastName cannot be blank'
            });
        }
        if(!email){
            return res.send({
                success : false,
                message : 'Error: Email cannot be blank'
            });
        }
        if(!password){
            return res.send({
                success : false,
                message : 'Error: Password cannot be blank'
            });
        }
        
        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, previousUsers) => {
            if(err){
                return res.send({
                    success : false,
                    message : 'Error: Server error'
                });
            } else if(previousUsers.length > 0){
                return res.send({
                    success : false,
                    message : 'Error: Account already exist.'
                });
            }

            const newUser = new User();
            newUser.email = email;
            newUser.firstName = firstName;
            newUser.lastName = lastName;
            newUser.password = newUser.generateHash(password)
            newUser.save((err, user) => {
                if(err){
                    return res.send({
                        success : false,
                        message : 'Error: Server error'
                    });
                }
                return res.send({
                    success : true,
                    message : 'Success: Singed up'
                });
            })
        });
    });

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const {
            password
        } = body;
        let {
            email
        } = body;

        if(!email){
            return res.send({
                success : false,
                message : 'Error: Email cannot be blank'
            });
        }
        if(!password){
            return res.send({
                success : false,
                message : 'Error: Password cannot be blank'
            });
        }
        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, users) => {
            if(err){
                return res.send({
                    success : false,
                    message : 'Error: Server error'
                });
            }
            if(users.length != 1){
                return res.send({
                    success : false,
                    message : 'Error: Invalid'
                });
            }

            const user = users[0];
            if(!user.validPassword(password)){
                return res.send({
                    success : false,
                    message : 'Error: Invalid'
                });
            }

            const userSession = new UserSession();
            userSession.userID = user._id;
            userSession.save((err, doc) => {
                if(err){
                    return res.send({
                        success : false,
                        message : 'Error: Server error'
                    });
                }
                return res.send({
                    success : true,
                    message : 'Success: Valid sign in',
                    token: doc._id
                });
            })
        });
    });

    app.get('/api/account/verify', (req, res, next) => {
        const { query } = req;
        const { token } = query;
        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if(err){
                return res.send({
                    success: false,
                    message: 'Error: Server erorr'
                });
            }
            if(sessions.length != 1){
                return res.send({
                    success: false,
                    message: 'Error: Invalid'
                });
            } else{
                return res.send({
                    success: true,
                    message: 'Success: Good'
                });
            }
        });
    });
};
  