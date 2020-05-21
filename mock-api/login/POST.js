module.exports = (req, res) => {
  const { email, password } = req.body;

  if (email === 'invalid' || password !== 'password') {
    return res.status(401).send({
      type: 'error',
      data: 'Incorrect credentials',
    });
  }

  return res.status(201).send({
    type: 'success',
    data: {
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
    },
  });
};
