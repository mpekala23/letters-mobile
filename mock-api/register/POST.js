/* eslint-disable camelcase */
// Disabling is necessary because snake case variables
// must remain to be consistent with letters-api

module.exports = (req, res) => {
  const {
    email,
    first_name,
    last_name,
    phone,
    addr_line_1,
    addr_line_2,
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
    data: {
      id: '6',
      first_name,
      last_name,
      email,
      phone,
      addr_line_1,
      addr_line_2,
      country,
      postal,
      city,
      state,
      token: 'dummy token',
    },
  });
};
