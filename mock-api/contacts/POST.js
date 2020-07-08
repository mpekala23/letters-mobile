/* eslint-disable camelcase */
// the above disabling is necessary because the snake case variable names are not our decision,
// but must remain to be consistent with letters-api

module.exports = (req, res) => {
  const {
    id,
    first_name,
    last_name,
    inmate_number,
    relationship,
    state,
    facility,
    credit,
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
      id,
      first_name,
      last_name,
      inmate_number,
      relationship,
      state,
      facility,
      credit,
    },
  });
};
