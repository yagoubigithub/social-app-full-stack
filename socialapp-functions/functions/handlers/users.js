const { db , admin } = require("../util/admin");

const config = require("../util/config");

const firebase_app = require("@firebase/app");
require("@firebase/auth");
require("@firebase/firestore");

const firebase = firebase_app.firebase;

const { validateSignUpData, validateLoginData ,reduceUserDetails } = require("../util/validators");

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

  const noImge = 'no-img.png';
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
        imageUrl : `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImge}?alt=media` ,
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
// get own user information

exports.getAuthenticatedUser = (req,res)=>{

  let userData = {};

  db.collection('users').doc(req.user.handle).get()
  .then((doc)=>{
    if(doc.exists){
      userData.credentials = doc.data();
      return db.collection('likes').where('userHandle', '==', req.user.handle).get();
    }
  }).then(data=>{
    userData.likes = [];
    data.forEach(doc=>{
      userData.likes.push(doc.data());
    });
    return res.json(userData)
  }).catch(error=>{
    console.log( error);
    return  res.status(500).json({error :  error.code})
  })
}

/*
{
"bio" : "Hello my name is user5, nice to  meet you",
        "website" : "https://user_5.com",
        "location" : "london,UK"
}
{
	"email" : "user5@gmail.com",
	"password" : "aek1234"
}
*/


/// add user details email,handle..
exports.addUserDetails = (req,res)=>{

  let userDetails  = reduceUserDetails(req.body);

  db.collection('users').doc(req.user.handle).update(userDetails)
  .then(()=>{
    return res.json({message : "Details added succefuly"});
  })
  .catch(error=>{
    console.log(error);
    return res.status(500).json({error :  error.code})
  })
}


//Upload a profile image
exports.uploadImage = (req,res) =>{
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs= require('fs');

  const busboy = new BusBoy({headers : req.headers});

  let imageFileName;
  let imageToBeUploaded = {};
  busboy.on('file',(fieldname, file, filename, encoding, mimetype)=>{

    if(mimetype !== 'image/png' && mimetype !== 'image/jpeg'){
      return res.status(400).json({
        error : 'Wrong file type submmited'
      })
    }
    const imageExtension = filename.split('.')[filename.split('.').length - 1];
     imageFileName = `${new Date().getMilliseconds}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(),imageFileName);
    imageToBeUploaded = {filepath,mimetype}

    file.pipe(fs.createWriteStream(filepath));

  });
  busboy.on('finish',()=>{

    admin.storage().bucket().upload(imageToBeUploaded.filepath,{
      resumable : false,      
      metadata : {
        metadata : {
          contentType : imageToBeUploaded.mimetype
        }
      }
    }).then(()=>{
      const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media` 
    
      return db.collection('users').doc(req.user.handle).update({imageUrl});
    
    })
    .then(()=>{
      return res.json({message : "message uploaded successfully"})
    })
    .catch(error=>{
      console.log(error);
      return res.status(500).json({error : error.code})
    })
  })

  busboy.end(req.rawBody);
  
}