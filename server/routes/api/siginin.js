const User = require('../../models/User');
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
            newUser.password = newUser.generateHash(password);
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
};
  