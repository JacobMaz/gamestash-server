const jwt = require("jsonwebtoken");
const { User } = require("../models");
// const { model } = require("../db");

const validateSession = (req, res, next) => {
    if (req.method === "OPTIONS") {
        return next();
    } else if (req.headers.authorization) {
        const { authorization } = req.headers;
        const payload = authorization ? jwt.verify(authorization, process.env.JWT_SECRET) : undefined;
        console.log(payload);

        if (payload) {
            User.findOne({
                where: { id: payload.id }
            })
                .then(user => {
                    console.log("REQUEST BEFORE", req.user)
                    req.user = user;
                    console.log("REQUEST AFTER", req.user)
                    next()
                })
        } else {
            res.status(401).json({
                message: "Not Authorized."
            })
        }
    } else {
        res.status(401).json({
            message: "Not allowed."
        })
    }
}

module.exports = validateSession;