module.exports = (req, res) => {
  const { firstName, lastName, inmateNumber, relationship, state, facility } = req.body;

  if (inmateNumber === '123456789') {
    return res.status(401).send({
      type: 'error',
      data: 'Invalid inmate number',
    });
  }

  return res.status(201).send({
    type: 'success',
    data: {
      firstName,
      lastName,
      inmateNumber,
      relationship,
      state,
      facility,
    },
  });
};
