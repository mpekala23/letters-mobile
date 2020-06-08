module.exports = (req, res) => {
  const { email, password } = req.body;

  if (email === 'invalid' || password !== 'password') {
    return res.status(401).send({
      status: 'ERROR',
      message: 'Incorrect credentials',
      data: [],
    });
  }

  return res.status(201).send({
    status: 'OK',
    data: [
      {
        id: '6',
        firstName: 'Team',
        lastName: 'Ameelio',
        email: 'team@ameelio.org',
        cell: '4324324432',
        address1: 'Somewhere',
        country: 'USA',
        zipcode: '12345',
        city: 'New Haven',
        state: 'CT',
      },
    ],
  });
};
