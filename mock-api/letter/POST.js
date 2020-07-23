/* eslint-disable camelcase */
// the above disabling is necessary because the snake case variable names are not our decision,
// but must remain to be consistent with letters-api

module.exports = (req, res) => {
  const {
    letter_id,
    contact_id,
    content,
    is_draft,
    s3_img_urls,
    type,
    size,
  } = req.body;

  if (!content) {
    return res.status(401).send({
      type: 'ERROR',
      data: 'Invalid letter',
    });
  }

  return res.status(201).send({
    type: 'SUCCESS',
    data: {
      letter_id: letter_id || 16,
      contact_id,
      content,
      is_draft,
      s3_img_urls,
      type,
      size,
    },
  });
};
