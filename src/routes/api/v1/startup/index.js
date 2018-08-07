import StartupInfo from '../../../../models/StartupInfo'

const startup = {
  post(req, res) {
    let startupInfo = new StartupInfo(req.body)
    startupInfo.save(err => {
      if (err) {
        return res.json({error: err.toString()})
      }
      res.json({
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
