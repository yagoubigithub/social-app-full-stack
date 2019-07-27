const functions = require("firebase-functions");

const app = require("express")();

const {db} = require('./util/admin');
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser
} = require("./handlers/users");
const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likescream,
  unLikeScream,
  deleteScream
} = require("./handlers/screams");

const FBAuth = require("./util/fbAuth");

//users route

app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

//Scream route
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);
app.get("/scream/:screamId", getScream);
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);
app.delete("/scream/:screamId", FBAuth, deleteScream);
app.get("/scream/:screamId/like", FBAuth, likescream);
app.get("/scream/:screamId/unlike", FBAuth, unLikeScream);
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



exports.createNotificationOnLike = functions.region("europe-west1").firestore.document('likes/{id}')
.onCreate(snapshot=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists){
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt : new Date().toISOString(),
                recipient : doc.data().userHandle,
                sender :  snapshot.data().userHandle,
                read :false,
                screamId : doc.id,
                type : "like",

            })
        }
    })
    .then(()=>{
        return ;
    })
    .catch((error=>{
        console.log(error);
        return;
    }))
});

exports.deleteNotificationOnUnlike = functions.region("europe-west1").firestore.document('likes/{id}')
.onDelete(snapshot=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists){
            return db.doc(`/notifications/${snapshot.id}`).delete()
        }
    })
    .then(()=>{
        return ;
    })
    .catch((error=>{
        console.log(error);
        return;
    }))
});





exports.createNotificationOnComment = functions.region("europe-west1").firestore.document('comments/{id}')
.onCreate(snapshot=>{
    db.doc(`/screams/${snapshot.data().screamId}`).get()
    .then(doc=>{
        if(doc.exists){
            return db.doc(`/notifications/${snapshot.id}`).set({
                createdAt : new Date().toISOString(),
                recipient : doc.data().userHandle,
                sender :  snapshot.data().userHandle,
                read :false,
                screamId : doc.id,
                type : "comment",

            })
        }
    })
    .then(()=>{
        return ;
    })
    .catch((error=>{
        console.log(error);
        return;
    }))
})