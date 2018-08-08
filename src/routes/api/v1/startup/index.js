import StartupInfo from '../../../../models/StartupInfo'

const startup = {
  post(req, res) {
    if (!req.body.name) {
      return res.json({error: 'Startup name is required'})
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
