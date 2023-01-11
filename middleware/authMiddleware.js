import User from '../models/User.js';
import jwt from "jsonwebtoken";

const checkAuth = async (req, res, next) => {

    let token = req.headers.authorization;
    
    if( !token || !token.startsWith('Bearer ') ) {
        const error = new Error('Token not found');
        return res.status(403).json({ msg: error.message });
    }

    try {
        token = token.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select(
            '-password -token -confirm -__v'
        );

    } catch (e) {
        console.log(e);
        const error = new Error('Invalid token');
        return res.status(403).json({ msg: error.message });
    }

    next();
};

export default checkAuth;