import mongoose from 'mongoose'

const CofounderInfoSchema = new mongoose.Schema({
  name: String,
  designation: String
});

const legalEntitySchema = new mongoose.Schema({
  name: String,
  designation: String
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
  facilitiesNeededFromGUSEC: String,
  gusecPremisesAccess: String
})

let StartupInfo

if (mongoose.models.StartupInfo) {
  StartupInfo = mongoose.model('StartupInfo')
} else {
  StartupInfo = mongoose.model('StartupInfo', StartupInfoSchema)
}

export default StartupInfo
