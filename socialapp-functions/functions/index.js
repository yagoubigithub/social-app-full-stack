const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();


const express = require('express');

const app = express();


app.get('/screams',(req, res) => {
  console.log("screams hhhh");
  admin
  .firestore()
  .collection("screams")
  .orderBy('createdAt', 'desc')
  .get()
  .then(data => {
    let screams = [];
    data.forEach(doc => {
      screams.push({
        screamId : doc.id,
        ...doc.data()
      });
    });
    return res.json(screams);
  })
  .catch(error => {
    console.log(error);
  });
 } )


app.post('/scream',(req, res) => {
 
  const newScream = {
    body: req.body.body,
    userHandel: req.body.userHandel,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };
  admin
    .firestore()
    .collection("screams")
    .add(newScream)
    .then(doc=>{
      console.log( res.json({message : `document ${doc.id} created Successfuly`  }));
        return res.json({message : `document ${doc.id} created Successfuly`  })
    }).catch(error=>{
        console.log(error)
      return  res.status(500).json({error : `somthing went wrong`});
       
    });
});


exports.api = functions.https.onRequest(app);