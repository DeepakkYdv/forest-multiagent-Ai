import redis from "../../shared/redis/redis.js";

 const protect = async (req, res, next) => {
    try {
        const sessionId = req.cookies?.session;
        if (!sessionId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        // get data from redis and send it to the next middleware
        const data = await redis.get(`session-${sessionId}`);
        if (!data) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.userData = JSON.parse(data);
        if (!req.userData?.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    } catch (err) {
        console.error('Error in protect middleware:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
export default protect;
