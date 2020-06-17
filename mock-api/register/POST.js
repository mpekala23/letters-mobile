module.exports = (req, res) => {
  const {
    email,
    firstName,
    lastName,
    phone,
    address1,
    address2,
    country,
    postal,
    city,
    state,
  } = req.body;

  if (email === 'used@gmail.com') {
    return res.status(401).send({
      type: 'error',
      data: 'Email in use',
    });
  }

  return res.status(201).send({
    type: 'success',
    data: {
      id: '6',
      firstName,
      lastName,
      email,
      phone,
      address1,
      address2,
      country,
      postal,
      city,
      state,
    },
  });
};
