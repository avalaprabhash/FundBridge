const express = require('express');
const router = express.Router();
const {
    getAllCampaigns,
    getCampaignById,
    createCampaign,
    donateToCampaign
} = require('../controllers/campaignController');

router.get('/', getAllCampaigns);
router.get('/:id', getCampaignById);
router.post('/', createCampaign);
router.post('/:id/donate', donateToCampaign);

module.exports = router;
