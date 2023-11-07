function commonErrors(res,stCode, cnt) {
  return res.status(stCode).send(cnt);
}

module.exports = {
    commonErrors
}