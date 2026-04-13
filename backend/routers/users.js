import {User} from "../models/index.js";
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const userList = await User.find().select('-passwordHash');

        if (userList.length === 0) {
            return res.status(404).send("Not Found Users");
        }

        res.status(200).send(userList);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-passwordHash');

        if (!user) {
            res.status(404).send("The user with this id does not exist");
        }

        res.status(200).send(user);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
})

router.post("/", async (req, res) => {
    try {
        let user = new User({
            name: req.body.name,
            email: req.body.email,
            passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
            phone: req.body.phone,
            isAdmin: req.body.isAdmin,
            apartment : req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
            street: req.body.street,
        });

        user = await user.save();

        if (!user) return res.status(404).send("The user cannot be created!");

        res.status(201).send(user);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User could not be created",
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).send("User does not exist");
        }

        if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
            return res.status(400).send("Password is incorrect");
        }

        const token = jwt.sign(
            { userId: user.id },
            'secret',
            {expiresIn: '1d'},
        );

        return res.status(200).send({ user: user.email, token });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
