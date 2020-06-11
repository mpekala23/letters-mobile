module.exports = (req, res) => {
  console.log(req.params);
  res.status(201).send();
};
