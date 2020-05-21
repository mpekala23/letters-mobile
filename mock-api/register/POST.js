module.exports = (req, res) => {
  const { username, password } = req.body;

  if (username === 'invalid' || password !== 'password') {
    return res.sendStatus(409);
  }

  return res.status(201).send({
    id: '6',
    firstName: 'Evan',
    lastName: 'Legrand',
    email: 'eleg@college',
    cell: '6127038623',
    address1: 'Address1',
    address2: 'Address2',
    country: 'USA',
    zipcode: '55419',
    city: 'Minneapolis',
    state: 'MN',
  });
};
