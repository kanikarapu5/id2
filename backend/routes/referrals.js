const router = require('express').Router();
const auth = require('../middleware/auth');
const PartnerReferral = require('../models/PartnerReferral');
const User = require('../models/User');
const crypto = require('crypto');

// @route   POST api/referrals/generate
// @desc    Generate a referral link for a partner
// @access  Private (Partner)
router.post('/generate', auth, async (req, res) => {
  try {
    // Check if the user is a partner
    const user = await User.findById(req.user.id);
    if (user.role !== 'Partner') {
      return res.status(403).json({ msg: 'User is not a partner' });
    }

    // Check if the partner already has a referral code
    let referral = await PartnerReferral.findOne({ partner: req.user.id });
    if (referral) {
      return res.json({ referralLink: `http://localhost:3000/register?ref=${referral.referralCode}` });
    }

    // Generate a unique referral code
    const referralCode = crypto.randomBytes(8).toString('hex');

    // Create and save the new referral code
    referral = new PartnerReferral({
      partner: req.user.id,
      referralCode,
    });
    await referral.save();

    res.json({ referralLink: `http://localhost:3000/register?ref=${referralCode}` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
