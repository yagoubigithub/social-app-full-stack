const functions = require("firebase-functions");


const app = require("express")();

const {signup,login,uploadImage,addUserDetails,getAuthenticatedUser} = require('./handlers/users');
const {getAllScreams,postOneScream,getScream, commentOnScream,likescream,unLikeScream} = require('./handlers/screams');

const FBAuth = require('./util/fbAuth');

//users route

app.post("/signup",signup );
app.post('/login', login)
app.post('/user/image',FBAuth,uploadImage)
app.post('/user',FBAuth,addUserDetails)
app.get('/user',FBAuth,getAuthenticatedUser);


//Scream route
app.get("/screams",getAllScreams);
app.post("/scream",FBAuth, postOneScream);
app.get('/scream/:screamId', getScream)
app.post('/scream/:screamId/comment', FBAuth, commentOnScream)
//TODO : delete scream
app.get('/scream/:screamId/like',FBAuth, likescream)
app.get('/scream/:screamId/unlike',FBAuth, unLikeScream)
//TODO : comment on scream


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





exports.api = functions.region("europe-west1").https.onRequest(app);
