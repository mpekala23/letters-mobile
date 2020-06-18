module.exports = (req, res) => {
  const { token } = req.body;

  if (token !== "dummy token") {
    return res.status(401).send({
      status: "ERROR",
      message: "Invalid token",
      data: [],
    });
  }

  return res.status(201).send({
    status: "OK",
    data: {
      id: "6",
      first_name: "Team",
      last_name: "Ameelio",
      email: "team@ameelio.org",
      phone: "4324324432",
      addr_line_1: "Somewhere",
      country: "USA",
      postal: "12345",
      city: "New Haven",
      state: "CT",
      token: "dummy token",
    },
  });
};
