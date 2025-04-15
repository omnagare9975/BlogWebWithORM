const { UserModel } = require('../Models/User');
const bcrypt = require('bcrypt');

const UserSignup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const GenSalt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, GenSalt);

        const CreateUser = await UserModel.create({
            name,
            email,
            password: hashedPass
        });

        const SuccessMessage = `Signup Successful with name: ${CreateUser.name}`;
        return res.render('ShowMessage', { message: SuccessMessage });

    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.send('Email already exists!');
        }
        return res.send(`Internal Server Error: ${error}`);
    }
};

module.exports = UserSignup;
