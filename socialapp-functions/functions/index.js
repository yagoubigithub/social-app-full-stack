const functions = require("firebase-functions");


const app = require("express")();

const {signup,login,uploadImage} = require('./handlers/users');
const {getAllScreams,postOneScream} = require('./handlers/screams');

const FBAuth = require('./util/fbAuth');

//users route

app.post("/signup",signup );
app.post('/login', login)

//Scream route
app.get("/screams",getAllScreams);
app.post("/scream",FBAuth, postOneScream);
app.post('/user/image',FBAuth,uploadImage)







exports.api = functions.region("europe-west1").https.onRequest(app);
