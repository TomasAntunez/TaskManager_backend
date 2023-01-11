import User from '../models/User.js';
import generateJWT from '../helpers/generateJWT.js';
import validateRegister from "../validators/registerValidator.js";
import validatePassword from '../validators/passwordValidator.js';
import validateEmail from '../validators/emailValidator.js';
import validateLogin from '../validators/loginValidator.js';
import validateEdit from  '../validators/editValidator.js'
import generateToken from '../helpers/generateToken.js';
import emailRegister from '../helpers/emailRegister.js';
import emailForgetPassword from '../helpers/emailForgetPassword.js';


const register = async (req, res) => {

    const { name, email, password } = req.body;

    const notValid = validateRegister(name, email, password);
    if( notValid ) {
        return res.status(400).json(notValid);
    }

    const userExists = await User.findOne({ email });
    if( userExists ) {
        const error = new Error('User already exists');
        return res.status(400).json({ msg: error.message });
    }

    try {
        const user = new User(req.body);
        user.token = generateToken();
        await user.save();

        emailRegister({
            name,
            email,
            token: user.token
        });

        res.json({ msg: 'Created user, check your email' });

    } catch (error) {
        console.log(error);
    }
};

const confirm = async (req, res) => {

    const { token } = req.params;
    const user = await User.findOne({token});

    if( !user ) {
        const error = new Error("Invalid token")
        return res.status(404).json({ msg: error.message });
    }

    try {
        user.confirm = true;
        user.token = null;
        await user.save();

        res.json({ msg: 'Confirmed Account' });

    } catch (error) {
        console.log(error);
    }
};


const authenticate = async (req, res) => {

    const { email, password } = req.body;

    const notValid = validateLogin( email, password );
    if( notValid ) {
        return res.status(400).json(notValid);
    }

    const user = await User.findOne({ email });
    if( !user ) {
        const error = new Error('The user does not exist');
        return res.status(404).json({ msg: error.message });
    }

    if( !user.confirm ) {
        const error = new Error('The user has not confirmed his account');
        return res.status(403).json({ msg: error.message });
    }

    if( ! await user.checkPassword(password) ) {
        const error = new Error('Incorrect password');
        return res.status(403).json({ msg: error.message });
    }

    user.token = generateJWT(user._id)

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: user.token
    });
};


const returnUser = (req, res) => {

    const { user } = req;
    res.json(user);
};


const verifyUser = async (req, res) => {
    
    const { email } = req.body;

    const notValid = validateEmail(email);
    if( notValid ) {
        return res.status(400).json(notValid);
    }

    const user = await User.findOne({ email });
    if( !user ) {
        const error = new Error('The user does not exist');
        return res.status(404).json({ msg: error.message });
    }

    if( !user.confirm ) {
        const error = new Error('The user has not confirmed his account');
        return res.status(403).json({ msg: error.message });
    }

    try {
        user.token = generateToken();
        await user.save();

        emailForgetPassword({
            name: user.name,
            email: email,
            token: user.token
        })

        res.json({ msg: 'Instructions were sent to your email' });

    } catch (error) {
        console.log(error);
    }
};


const validateToken = async (req, res) => {

    const { token } = req.params;
    
    if( ! await User.findOne({ token }) ) {
        const error = new Error('There was a mistake');
        return res.status(403).json({ msg: error.message });
    }

    res.json({ msg: 'Enter your new password' });
};


const newPassword = async (req, res) => {

    const { token } = req.params;

    const user = await User.findOne({ token });
    if( !user ) {
        const error = new Error('There was a mistake');
        return res.status(400).json({ msg: error.message });
    }

    const { password } = req.body;

    const notValid = validatePassword( password );
    if( notValid ) {
        return res.status(400).json(notValid);
    }

    try {
        user.token = null;
        user.password = password;
        await user.save();

        res.json({ msg: 'Password changed successfully' });

    } catch (error) {
        console.log(error);
    }
};


const updateProfile = async (req, res) => {

    const user = await User.findById(req.params.id);

    if( !user ) {
        const error = new Error('There was a mistake');
        return res.status(400).json({ msg: error.message });
    }

    const { name, email } = req.body;

    const notValid = validateEdit(name, email);
    if( notValid ) {
        return res.status(400).json(notValid);
    }

    if( user.email !== email ) {
        const userExists = await User.findOne({ email });
        if( userExists ) {
            const error = new Error('That email is already in use');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        user.name = name;
        user.email = email;

        const updatedUser = await user.save();
        res.json(updatedUser);

    } catch (error) {
        console.log(error);
    }
}


const updatePassword = async (req, res) => {

    const { _id } = req.user;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(_id);
    if( !user ) {
        const error = new Error('There was a mistake');
        return res.status(400).json({ msg: error.message });
    }

    if( ! await user.checkPassword(currentPassword) ) {
        const error = new Error('Password is incorrect');
        return res.status(400).json({ msg: error.message })
    }

    user.password = newPassword;
    await user.save();

    res.json({ msg: 'Password stored correctly' })
}


export {
    register,
    confirm,
    authenticate,
    returnUser,
    verifyUser,
    validateToken,
    newPassword,
    updateProfile,
    updatePassword
};