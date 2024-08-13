const getIndex = (req, res) => {
  res.status(200).json({
    status: {
      code: 200,
      message: "WA bot is running",
    },
    data: null,
  });
};

module.exports = {
  getIndex,
};
