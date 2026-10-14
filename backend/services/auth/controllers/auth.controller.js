import { getAuth } from "firebase-admin/auth";
import { app } from "../config/firebase.js";

export const login = async (req, res) => {
    const { token } = req.body ?? {};
    if (typeof token !== "string" || token.length === 0) {
        return res.status(400).json({ message: "A Firebase ID token is required" });
    }

    try {
        const decodedToken = await getAuth(app).verifyIdToken(token);
        return res.status(200).json({
            uid: decodedToken.uid,
            email: decodedToken.email ?? null,
            emailVerified: decodedToken.email_verified ?? false,
        });
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