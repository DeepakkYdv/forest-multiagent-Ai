import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";
import User from "../models/user.model.js";

export const login = async (req, res) => {
    const { token } = req.body ?? {};
    if (typeof token !== "string" || token.length === 0) {
        return res.status(400).json({ message: "A Firebase ID token is required" });
    }

    try {
        const decodedToken = await getAuth(app).verifyIdToken(token);
        //decodeToken contains the decoded information from the Firebase ID token, such as the user's UID, email, and other claims. You can use this information to authenticate the user in your application.  
        const userRecord = await getAuth(app).getUser(decodedToken.uid);
        const user=await User.findOne({ uid: decodedToken.uid });
        if(!user){
            user=await User.create({
                firebaseUid:decodedToken.uid,
                name:userRecord.displayName ?? "Anonymous",
                email:userRecord.email ?? null
            });
        }
        // to login for 7 days
        const sessionId=crypto.randomUUID(); 
        res.cookie("session", sessionId, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,sameSite: "strict" });
        return res.status(200).json({ message: "Login successful", user });
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