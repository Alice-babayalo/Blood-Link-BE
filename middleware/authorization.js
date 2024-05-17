import jwt from "jsonwebtoken";
import config from "../configs/index.js";
import AdminModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        // Get the token from the request headers
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decodedToken = jwt.verify(token, config.JWT_SECRET_KEY);
        const user = await AdminModel.findById(decodedToken.userId);
        req.user = user;

        // Continue to the next middleware or route handler
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export { authMiddleware };