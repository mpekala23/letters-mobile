module.exports = (req, res) => {
  const {
    email,
    firstName,
    lastName,
    cell,
    address1,
    address2,
    country,
    zipcode,
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
        firstName,
        lastName,
        email,
        cell,
        address1,
        address2,
        country,
        zipcode,
        city,
        state,
      },
    ],
  });
};
