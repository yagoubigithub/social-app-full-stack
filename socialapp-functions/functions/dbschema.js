let db = {
  users: [
    {
        userId: "AM91kr6cwMOsFOIQX3aDQIq2DxI2",
        handle: "user5",
        email: "user5@gmail.com",
      createdAt: "2019-07-16T14:26:09.825Z",
      
     
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/social-media-app-7046a.appspot.com/o/7115042.docx?alt=media",

        bio : "Hello my name is user5, nice to  meet you",
        website : "https://user5.com",
        location : "London,UK",
      
    }
  ],
  screams: [
    {
      screamId: "g6O3wZBCeuaeoo7k854K",
      createdAt: "",
      userHandel: "ff",
      body: "Hello body",
      likeCount: 5,
      commentCount: 2
    }
  ]
};
const userDetails = {

    // Redux data

    credentials : {
        userId: "AM91kr6cwMOsFOIQX3aDQIq2DxI2",
        handle: "user5",
        email: "user5@gmail.com",
      createdAt: "2019-07-16T14:26:09.825Z",
      
     
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/social-media-app-7046a.appspot.com/o/7115042.docx?alt=media",

        bio : "Hello my name is user5, nice to  meet you",
        website : "https://user5.com",
        location : "London,UK",
    },
    likes  : [
        {
            userHandel : 'user2',
            screamId :  'g6O3wZBCeuaeoo7k854K'
        }
    ]
}