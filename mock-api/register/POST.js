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
      status: 'ERROR',
      message: 'Email in use',
      data: [],
    });
  }

  return res.status(201).send({
    status: 'OK',
    data: [
      {
        id: '6',
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        addr_line_1: address1,
        addr_line_2: address2,
        country,
        postal,
        city,
        state,
        token: 'dummy token',
      },
    ],
  });
};
