const client = require('../config/whatsapp');

const getAuthStatus = async (req, res) => {
    try {
        const state = await client.getState();
        res.json({
            status: true,
            data: {
                authenticated: state !== null,
                state: state || 'DISCONNECTED'
            }
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error getting authentication status',
            error: error.message
        });
    }
};

const logout = async (req, res) => {
    try {
        await client.logout();
        res.json({
            status: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            message: 'Error logging out',
            error: error.message
        });
    }
};

module.exports = {
    getAuthStatus,
    logout
};