const { db } = require("../util/admin");

const config = require("../util/config");

const firebase_app = require("@firebase/app");
require("@firebase/auth");
require("@firebase/firestore");

const firebase = firebase_app.firebase;

const { validateSignUpData, validateLoginData } = require("../util/validators");

firebase.initializeApp(config);

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  const { valid, errors } = validateSignUpData(newUser);

  if (!valid) return res.status(400).json({ errors });

  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res.status(400).json({ error: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(data => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const userCredential = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId
      };
      return db
        .collection("users")
        .doc(newUser.handle)
        .set(userCredential)
        .then(() => {
          return res.status(201).json({ token });
        });
    })
    .catch(error => {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already exixt" });
      } else {
        return res.status(500).json({ error: error.code });
      }
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) return res.status(400).json({ errors });

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(data => {
      return data.user.getIdToken();
    })
    .then(token => {
      return res.json({ token });
    })
    .catch(error => {
      console.log(error);

      if (error.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, please try again" });
      } else return res.status(500).json({ error: error.code });
    });
};
