import StartupInfo from '../../../../models/StartupInfo'

const startup = {
  post(req, res) {
    if (!req.body.name) {
      return res.json({error: 'Startup name is required'})
    }
    if (!req.body.founderName) {
      return res.json({error: 'Founder name is required'})
    }
    if (!req.body.totalMemberCount) {
      return res.json({error: 'Total member count is missing'})
    }
    if (!req.body.typeOfIncorporation) {
      return res.json({error: 'Incorporation name is required'})
    }
    if (!req.body.raisedFunds) {
      return res.json({error: 'Raisedfund is required'})
    }
    if (!req.body.registeredAddress) {
      return res.json({error: 'Registered Address name is required'})
    }
    if (!req.body.founderEmailAddress) {
      return res.json({error: 'Founder Email Address is missing'})
    }
    if (!req.body.founderContactNumber) {
      return res.json({error: 'Founder Contact Number name is required'})
    }
    let startupInfo = new StartupInfo(req.body)
    startupInfo.save(err => {
      if (err) {
        return res.json({error: err.toString()})
      }
      res.json({
        message: 'Application submitted successfully',
        data: startupInfo
      })
    })
  },
  get(req, res) {
    StartupInfo.find({}, (err, startup) => {
        if (err) {
          return res.json({error: err.toString()})
        }
        res.json({
          data: startup
        })
      
    })
  }
}

export default startup
