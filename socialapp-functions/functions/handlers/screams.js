const { db } = require("../util/admin");
exports.getAllScreams = (req, res) => {
  console.log("screams hhhh");
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data()
        });
      });
      return res.json(screams);
    })
    .catch(error => {
      console.log(error);
    });
};

exports.postOneScream = (req, res) => {
  if (isEmpty(req.body.body))
    return res.status(400).json({ body: "Must not be empty" });
  const newScream = {
    body: req.body.body,
    userHandel: req.user.handle,
    createdAt: new Date().toISOString()
  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      console.log(
        res.json({ message: `document ${doc.id} created Successfuly` })
      );
      return res.json({ message: `document ${doc.id} created Successfuly` });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({ error: `somthing went wrong` });
    });
};
