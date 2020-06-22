/* eslint-disable camelcase */
// We have to disable ESLint rule here since snake case variable names are forced on us by the API

module.exports = (req, res) => {
  const {
    first_name,
    last_name,
    inmate_number,
    relationship,
    state,
    facility,
  } = req.body;

  if (inmate_number === '123456789') {
    return res.status(401).send({
      type: 'ERROR',
      data: 'Invalid inmate number',
    });
  }

  return res.status(201).send({
    type: 'SUCCESS',
    data: {
      id: 8,
      first_name,
      last_name,
      inmate_number,
      relationship,
      state,
      facility,
    },
  });
};
