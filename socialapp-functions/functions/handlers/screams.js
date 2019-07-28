const { db } = require("../util/admin");
exports.getAllScreams = (req, res) => {
 
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then(data => {
      let screams = [];
      data.forEach(doc => {
        screams.push({
          screamId: doc.id,
          ...doc.data(),
        });
      });
      return res.json(screams);
    })
    .catch(error => {
      console.log(error);
    });
};


// create scream
exports.postOneScream = (req, res) => {
  if (req.body.body.trim() === '')
    return res.status(400).json({ body: "Must not be empty" });
  const newScream = {
    body: req.body.body,
    userHandle: req.user.handle,
    createdAt: new Date().toISOString(),
    userImage : req.user.imageUrl,
    likeCount: 0,
    commentCount: 0

  };
  db.collection("screams")
    .add(newScream)
    .then(doc => {
      const resScream = newScream;
      resScream.screamId = doc.id;
      return res.json({ resScream });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({ error: `somthing went wrong` });
    });
};

//Fetch One scream
exports.getScream = (req, res) => {
  let screamData = {};
  db.doc(`/screams/${req.params.screamId}`)
    .get()
    .then(doc => {
      if (!doc.exists)
        return res.status(404).json({ error: "scream not found" });

      screamData = doc.data();
      screamData.screamId = doc.id;
      return db
        .collection("comments")
        .orderBy('createdAt', 'desc')
        .where("screamId", "==", req.params.screamId)
        .get();
    })
    .then(data => {
      screamData.comments = [];
      data.forEach(doc => {
        screamData.comments.push(doc.data());
      });
      return res.json(screamData);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({ error: error.code });
    });
};

// Comment on a comment 

exports.commentOnScream = (req, res) => {

  if(req.body.body.trim() === ''){
    return res.status(400).json({comment : "Must not be Empty"});
  }

  const newComments = {

    body : req.body.body,
    createdAt : new Date().toISOString(),
    screamId : req.params.screamId,
    userHandle : req.user.handle,
    userImage : req.user.imageUrl
  }

  db.doc(`/screams/${req.params.screamId}`).get()
  .then(doc=>{
    if(!doc.exists){
      return res.status(404).json({error : "Scream not found"})
    }
    return doc.ref.update({commentCount : doc.data().commentCount + 1});
  })
  .then(()=>{
    return db.collection('comments').add(newComments)
  })
    .then(()=>{
      return res.json(newComments)
    })
    .catch(error=>{
      console.log(error);
      return res.status(500).json({error : error.code})
    })
  

}


// Like a scream
exports.likescream= (req,res)=>{

  const likesDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
  .where('screamId', '==', req.params.screamId).limit(1)

  const screamDocument = db.doc(`/screams/${req.params.screamId}`)

  let screamData ;

  screamDocument.get()
  .then(doc => {
    if(doc.exists){
      screamData = doc.data();
      screamData.screamId = doc.id;
      return likesDocument.get();
    }else{
      return res.status(404).json({error  :  "Scream not found"});
    }
  }).then(data=>{
    if(data.empty){
      return db.collection('likes').add({
        screamId : req.params.screamId,
        userHandle : req.user.handle
      })
      .then(()=>{
        screamData.likeCount++;
        return screamDocument.update({likeCount : screamData.likeCount});
      })
      .then(()=>{
        return res.json(screamData);
      })
    }else{

      //TODO delete the like
      return res.status(404).json({error : "Scream already liked"})
    }
  })
  .catch(error =>{
    console.log(error);
    return res.status(500).json({error : error.code})
  })

};

// unlike a scream
exports.unLikeScream = (req, res)=>{
  const likesDocument = db.collection('likes').where('userHandle', '==', req.user.handle)
  .where('screamId', '==', req.params.screamId).limit(1)

  const screamDocument = db.doc(`/screams/${req.params.screamId}`)

  let screamData ;

  screamDocument.get()
  .then(doc => {
    if(doc.exists){
      screamData = doc.data();
      screamData.screamId = doc.id;
      return likesDocument.get();
    }else{
      return res.status(404).json({error  :  "Scream not found"});
    }
  }).then(data=>{
    if(data.empty){
      return res.status(400).json({error : "Scream not liked"});
    }else{

     
      return db.doc(`/likes/${data.docs[0].id}`).delete()
      .then(()=>{
        screamData.likeCount--;
       return db.doc(`/screams/${screamData.screamId}`).update({likeCount : screamData.likeCount})
      })
      .then(()=>{
        return res.json(screamData)
      })
    }
  })
  .catch(error =>{
    console.log(error);
    return res.status(500).json({error : error.code})
  })
}


// delete scream 

exports.deleteScream = (req,res) =>{
  const document = db.doc(`/screams/${req.params.screamId}`);

  document.get()
  .then(doc=>{
    if(!doc.exists){
      return res.status(404).json({error : "Scream not found"})
    }
    if(doc.data().userHandle !== req.user.handle){
      return res.status(403).json({error : "Unauthorized"})
    }else{
      document.delete();
    }
  })
  .then(()=>{
     res.json({message : "Scream deleted successfully"})
  })
  .catch(error=>{
    console.error(error);
    return res.status(500).json({error : error.code})
  })

}