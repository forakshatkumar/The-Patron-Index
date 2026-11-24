const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Register user
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists with this email address"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: role || "analyst"
        });

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET || 'my_secret_key_123',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: "User registered successfully",
            token,
            userId: user._id,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
};


// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};

// Google OAuth verification and login/register
const googleAuth = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ message: "Google credential is required" });
        }

        const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
        if (!googleRes.ok) {
            return res.status(401).json({ message: "Invalid or expired Google credential" });
        }

        const payload = await googleRes.json();
        const expectedClientId = process.env.GOOGLE_CLIENT_ID || "978238561753-daj7ignsgo9lbg31ag5c0ke3lukuarbh.apps.googleusercontent.com";

        if (payload.aud !== expectedClientId) {
            return res.status(401).json({ message: "Google token audience mismatch" });
        }

        const { email, name, sub: googleId, picture: avatar } = payload;
        if (!email) {
            return res.status(400).json({ message: "No email associated with Google account" });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        let user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-10) + Date.now().toString(), 10);
            user = await User.create({
                name: name || normalizedEmail.split('@')[0],
                email: normalizedEmail,
                password: randomPassword,
                role: "analyst",
                googleId,
                avatar: avatar || ""
            });
        } else if (googleId && !user.googleId) {
            user.googleId = googleId;
            if (avatar && !user.avatar) user.avatar = avatar;
            await user.save();
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET || "my_secret_key_123",
            { expiresIn: "24h" }
        );

        res.json({
            message: "Google login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar || avatar || ""
            }
        });
    } catch (error) {
        console.error("Google auth error:", error);
        res.status(500).json({ message: "Google authentication failed", error: error.message });
    }
};

module.exports = {
    register,
    login,
    googleAuth
};