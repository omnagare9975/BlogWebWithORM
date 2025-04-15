const { UserModel } = require('../Models/User');
const jwt = require('jsonwebtoken');
const loadEnv = require('../loadEnv');
const bcrypt = require('bcrypt');

const LoginFindUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ensure environment variables are loaded first
        const ConfitEnv = await loadEnv();

        // Sequelize uses findOne with a 'where' clause to search for the user by email
        const Finduser = await UserModel.findOne({ where: { email } });

        if (!Finduser) {
            return res.render('LoginFailed', { message: 'User not found' });
        }

        // Compare the password entered by the user with the hashed password stored in the database
        const isPasswordCorrect = bcrypt.compareSync(password, Finduser.password);

        if (isPasswordCorrect) {
            const UserObject = {
                name: Finduser.name,
                email: Finduser.email
            };

            // Now, use the loaded JWT secret from environment variables (process.env.JWT_SECRET)
            const Token = jwt.sign(UserObject, ConfitEnv.JWT_SECRET);

            // Set the token as a cookie in the response
            res.cookie('token', Token);

            // Redirect to the homepage or dashboard after successful login
            return res.render('HomePage');
        } else {
            return res.render('LoginFailed', { message: 'Wrong Password. Please try again.' });
        }

    } catch (error) {
        return res.send(`Internal Server Error: ${error}`);
    }
};

module.exports = LoginFindUser;
