import mongoose from 'mongoose'

const CofounderInfoSchema = new mongoose.Schema({
  name: String,
  designation: String
});

const legalEntitySchema = new mongoose.Schema({
  name: String,
  designation: String
});

const facilitiesNeededFromGUSECSchema = new mongoose.Schema({
  mentorship: {
    type: Boolean,
    default: false
  },
  support_in_fundraising: {
    type: Boolean,
    default: false
  },
  gusec_id_card: {
    type: Boolean,
    default: false
  },
  coworking_access: {
    type: Boolean,
    default: false
  },
  desktop_computer_access: {
    type: Boolean,
    default: false
  },
  dedicated_silent_zone: {
    type: Boolean,
    default: false
  },
  gusec_email_address: {
    type: Boolean,
    default: false
  }
});

const StartupInfoSchema = new mongoose.Schema({
  name: String,
  founderName: String,
  coFounders: [CofounderInfoSchema],
  totalMemberCount: String,
  typeOfIncorporation: String,
  legalEntityName: String,
  legalEntityMembers: [legalEntitySchema],
  raisedFunds: String,
  expectedFund: String,
  registeredAddress: String,
  founderResidentialAddress: String,
  founderContactNumber: String,
  founderEmailAddress: String,
  secondaryContactName: String,
  secondaryContactNumber: String,
  secondaryEmailAddress: String,
  startupWebsite: String,
  socialMediaLinks: [String],
  startupPAN: String,
  bankAccountNumber: String,
  bankName: String,
  bankIFSC: String,
  facilitiesNeededFromGUSEC: facilitiesNeededFromGUSECSchema,
  gusecPremisesAccess: String,
  applicationStatus: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Accepted', 'Rejected'],
    default: 'Submitted'
  }
})

let StartupInfo

if (mongoose.models.StartupInfo) {
  StartupInfo = mongoose.model('StartupInfo')
} else {
  StartupInfo = mongoose.model('StartupInfo', StartupInfoSchema)
}

export default StartupInfo
