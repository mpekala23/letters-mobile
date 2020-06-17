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
      firstName: 'Team',
      lastName: 'Ameelio',
      email: 'team@ameelio.org',
      phone: '4324324432',
      address1: 'Somewhere',
      country: 'USA',
      postal: '12345',
      city: 'New Haven',
      state: 'Connecticut',
    },
  });
};
