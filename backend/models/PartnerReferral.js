const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const partnerReferralSchema = new Schema({
  partner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  referralCode: {
    type: String,
    required: true,
    unique: true,
  },
}, {
  timestamps: true,
});

const PartnerReferral = mongoose.model('PartnerReferral', partnerReferralSchema);

module.exports = PartnerReferral;
