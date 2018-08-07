const onFailure = (res, err) => {
  console.log(err)
  res.status(500).json({message: err.message || 'Something went wrong'})
}

export default onFailure
