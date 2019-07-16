const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const app = require("express")();

const firebase_app = require("@firebase/app");
require("@firebase/auth");
require("@firebase/firestore");

const firebase = firebase_app.firebase;

const firebaseConfig = {
  apiKey: "AIzaSyAndfF4GnLLw9KjkfT9Nyw8uwOnFb74P-M",
  authDomain: "social-media-app-7046a.firebaseapp.com",
  databaseURL: "https://social-media-app-7046a.firebaseio.com",
  projectId: "social-media-app-7046a",
  storageBucket: "social-media-app-7046a.appspot.com",
  messagingSenderId: "670445989123",
  appId: "1:670445989123:web:a46d5a2ed795904f"
};

firebase.initializeApp(firebaseConfig);
const db = admin.firestore();


const FBAuth = (req,res,next)=>{
  let idToken;
 if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
   idToken = req.headers.authorization.split('Bearer ')[1];
 }else{
   console.error("No token Found");
   return res.status(403).json({error : "Unauthorized"})
 }

 admin.auth().verifyIdToken(idToken)
 .then(decodedIdToken=>{
   req.user = decodedIdToken;
   console.log(decodedIdToken);
   return db.collection('users')
   .where('userId', '==',req.user.uid)
   .limit(1)
   .get();
 })
 .then(data=>{
   req.user.handle  = data.docs[0].data().handle;
   return next();
 })

 .catch(error=>{
   console.error('Error while verifying token', error);
   return res.status(403).json(error);
 })

}
app.get("/screams", (req, res) => {
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
});



app.post("/scream",FBAuth, (req, res) => {

  if(isEmpty(req.body.body)) return res.status(400).json({body : "Must not be empty"})


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
});

const isEmail = (email) =>{
  const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(emailRegEx);

}
const isEmpty = (string) => string.trim() === '';

//SignUp route

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };
  // TODO validate data
  
  let errors = {};
  if(isEmpty(newUser.email)){
    errors.email = "Must not be Empty";
  }else if(!isEmail(newUser.email)){
    errors.email = "Must be valid email address  "
  }


  if(isEmpty(newUser.password)){
    errors.password = "Must not be Empty";
  }

  if(newUser.password !== newUser.confirmPassword) errors.confirmPassword = "Password must match"

  if(Object.keys(errors).length > 0) return res.status(400).json({errors})
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
  .get()
  .then(doc=>{
    if(doc.exists){
      return res.status(400).json({error :  "this handle is already taken"})
    }else{
      return firebase
      .auth()
      .createUserWithEmailAndPassword(newUser.email, newUser.password);
    }
  }).then((data)=>{
    userId = data.user.uid;
    return data.user.getIdToken()
  }).then((idToken)=>{
    token = idToken;
    const userCredential = {
      handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
      userId 
    }
   return db.collection('users').doc(newUser.handle).set(userCredential)
    .then(()=>{
      return res.status(201).json({token})

    })
  }).catch(error=>{
    console.log(error);
    if(error.code === 'auth/email-already-in-use'){
      return res.status(400).json({email : "Email is already exixt"})
    }else{
      
      return res.status(500).json({error :  error.code})
    }

   
  })

});


app.post('/login', (req, res)=>{

  const user = {
    email : req.body.email,
    password :  req.body.password
  }

  let errors = {};

  if(isEmpty(user.email)) errors.email = "Must not be empty";
  if(isEmpty(user.password)) errors.password = "Must not be empty";

  if(Object.keys(errors).length > 0){
    return res.status(400).json({errors});
  }

  firebase
  .auth()
  .signInWithEmailAndPassword(user.email,user.password)
  .then(data=>{
    return data.user.getIdToken();
  })
  .then(token=>{
    return res.json({token})
  })
  .catch(error=>{
    
    console.log(error);

    if(error.code === 'auth/wrong-password'){
      return res.status(403).json({general : "Wrong credentials, please try again"})
    }else
    return res.status(500).json({error : error.code})
  })
  ;


})

exports.api = functions.region("europe-west1").https.onRequest(app);
