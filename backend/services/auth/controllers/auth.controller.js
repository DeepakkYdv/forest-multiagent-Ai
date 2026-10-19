import { randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import User from "../models/user.model.js";
import redis from "../../../shared/redis/redis.js";
import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";

const scrypt = promisify(scryptCallback);
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

const setSession = async (res, user) => {
    const sessionId = randomUUID();
    await redis.set(`session-${sessionId}`, JSON.stringify({
        userId: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
    }), "EX", SESSION_TTL_SECONDS);
    res.cookie("session", sessionId, {
        maxAge: SESSION_TTL_SECONDS * 1000,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
    });
};

const hashPassword = async (password) => {
    const salt = randomBytes(16).toString("hex");
    const hash = await scrypt(password, salt, 64);
    return `${salt}:${hash.toString("hex")}`;
};

const verifyPassword = async (password, storedHash) => {
    const [salt, hashHex] = storedHash.split(":");
    if (!salt || !hashHex) return false;
    const expected = Buffer.from(hashHex, "hex");
    const actual = await scrypt(password, salt, expected.length);
    return expected.length === actual.length && timingSafeEqual(expected, actual);
};

const publicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? null,
});

export const register = async (req, res) => {
    const { name, email, password } = req.body ?? {};
    if (typeof name !== "string" || !name.trim() ||
        typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim()) ||
        typeof password !== "string" || password.length < 8 || password.length > 128) {
        return res.status(400).json({ message: "Provide a name, valid email, and password between 8 and 128 characters" });
    }

    try {
        const normalizedEmail = email.trim().toLowerCase();
        if (await User.exists({ email: normalizedEmail })) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            passwordHash: await hashPassword(password),
        });
        await setSession(res, user);
        return res.status(201).json({ message: "Registration successful", user: publicUser(user) });
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ message: "An account with this email already exists" });
        }
        console.error("Registration failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { token, email, password } = req.body ?? {};
    if (typeof email === "string" || typeof password === "string") {
        if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password || password.length > 128) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        try {
            const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+passwordHash");
            if (!user?.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            await setSession(res, user);
            return res.status(200).json({ message: "Login successful", user: publicUser(user) });
        } catch (error) {
            console.error("Password login failed:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    if (typeof token !== "string" || token.length === 0) {
        return res.status(400).json({ message: "Provide email and password" });
    }
    try {
        // Load Firebase only when a Firebase token login is requested. Password
        // registration and login do not require Google/Firebase credentials.
        const decodedToken = await getAuth(app).verifyIdToken(token);
        //decodeToken contains the decoded information from the Firebase ID 
        // token, such as the user's UID, email, and other claims. You can use 
        // this information to authenticate the user in your application.  
        const userRecord = await getAuth(app).getUser(decodedToken.uid);
        let user = await User.findOne({ firebaseUid: decodedToken.uid });
        if (!user) {
            user = await User.create({
                firebaseUid: decodedToken.uid,
                name: userRecord.displayName ?? "Anonymous",
                email: userRecord.email ?? null,
                avatar: userRecord.photoURL ?? null
            });
        }
        // to login for 7 days
        await setSession(res, user);
        return res.status(200).json({ message: "Login successful", user: publicUser(user) });
    } catch (error) {
        if (
            [
                "auth/argument-error",
                "auth/id-token-expired",
                "auth/id-token-revoked",
                "auth/invalid-id-token",
            ].includes(error?.code)
        ) {
            return res.status(401).json({ message: "Invalid or expired Firebase ID token" });
        }
        console.error("Firebase ID token verification failed:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// logout
export const logout = async (req, res) => {
    try {
        const sessionId = req.cookies?.session;

        if (sessionId) {
            await redis.del(`session-${sessionId}`);
        }

        res.clearCookie("session", {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
        });

        return res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Logout failed:", error.message);

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};


