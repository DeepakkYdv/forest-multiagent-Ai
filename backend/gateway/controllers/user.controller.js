const getCurrentuser = (req, res) => {
    // Access the user data from the request object
    try {
        const userData = req.userData;
        if (!userData) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        res.json({ user: userData });
    } catch (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Internal Server Error'});
    }
};

export default getCurrentuser;
