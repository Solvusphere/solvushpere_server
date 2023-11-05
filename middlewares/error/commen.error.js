function commonErrors(res, cnt) {
  return res.status(400).send(cnt);
}

module.exports = {
    commonErrors
}