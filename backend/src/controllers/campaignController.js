const pool = require('../config/database');

const getAllCampaigns = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, title, description, 
                    target_amount::float AS "targetAmount", 
                    collected_amount::float AS "collectedAmount", 
                    days_left AS "daysLeft", 
                    image 
             FROM campaigns 
             ORDER BY id ASC`
        );
        return res.json(result.rows);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
    }
};

const getCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT id, title, description, 
                    target_amount::float AS "targetAmount", 
                    collected_amount::float AS "collectedAmount", 
                    days_left AS "daysLeft", 
                    image 
             FROM campaigns 
             WHERE id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        return res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch campaign' });
    }
};

const createCampaign = async (req, res) => {
    try {
        const { title, description, targetAmount, image } = req.body;

        if (!title || !description || !targetAmount) {
            return res.status(400).json({ success: false, message: 'Title, description, and targetAmount are required' });
        }

        const defaultImage = image || 'https://images.unsplash.com/photo-1523324930923-4726b841a1db?w=600';
        const daysLeft = 30;
        const collectedAmount = 0;

        const result = await pool.query(
            `INSERT INTO campaigns (title, description, target_amount, collected_amount, days_left, image)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id, title, description, 
                       target_amount::float AS "targetAmount", 
                       collected_amount::float AS "collectedAmount", 
                       days_left AS "daysLeft", 
                       image`,
            [title, description, targetAmount, collectedAmount, daysLeft, defaultImage]
        );

        return res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating campaign:', error);
        return res.status(500).json({ success: false, message: 'Failed to create campaign' });
    }
};

const donateToCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount, donorName } = req.body;

        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid donation amount is required' });
        }

        // Record donation
        await pool.query(
            `INSERT INTO donations (campaign_id, amount, donor_name) VALUES ($1, $2, $3)`,
            [id, donationAmount, donorName || 'Anonymous']
        );

        // Update campaign collected amount
        const result = await pool.query(
            `UPDATE campaigns 
             SET collected_amount = collected_amount + $1 
             WHERE id = $2
             RETURNING id, title, description, 
                       target_amount::float AS "targetAmount", 
                       collected_amount::float AS "collectedAmount", 
                       days_left AS "daysLeft", 
                       image`,
            [donationAmount, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Campaign not found' });
        }

        return res.json({
            success: true,
            message: 'Donation successful',
            campaign: result.rows[0]
        });
    } catch (error) {
        console.error('Error processing donation:', error);
        return res.status(500).json({ success: false, message: 'Failed to process donation' });
    }
};

module.exports = {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    donateToCampaign
};
