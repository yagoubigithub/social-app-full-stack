import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    LOADING_UI,
    POST_SCREAM,
    SET_ERRORS,
    CLEAR_ERRORS,
    SET_SCREAM,
    STOP_LOADING_UI,
    SUBMIT_COMMENT
  } from "../types";
import axios  from 'axios';


// Get all screams 
export const getScreams = ()=> dispatch=>{
    dispatch({type: LOADING_DATA});


    axios.get('/screams').then(res=>{
        dispatch({
            type : SET_SCREAMS,
            payload : res.data
        })
    })
    .catch(error=>{
        console.log(error)
        dispatch({
            type : SET_SCREAMS,
            payload : []
        })
    })
}
// get one scream
export const getScream = (screamId) => dispatch =>{


    dispatch({type : LOADING_UI});
    axios
    .get(`/scream/${screamId}`)
    .then((res) => {
      dispatch({
        type: SET_SCREAM,
        payload: res.data
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
}

//Post a scream 
export const postScream = (newScream) =>dispatch=>{
    dispatch({type : LOADING_UI});
    axios.post('/scream', newScream)
    .then(res=>{
        dispatch({
            type : POST_SCREAM,
            payload : res.data
        })
        dispatch(clearErrors())
    })
    .catch(error=>{
        dispatch({
            type : SET_ERRORS,
            payload  : error.response.data
        })
    })
}

//Like scream

export const likeScream = (screamId) => dispatch =>{
    axios.get(`/scream/${screamId}/like`)
    .then(res=>{
        dispatch({
            type : LIKE_SCREAM,
            payload : res.data
        })
    })
    .catch(error=>console.log(error))
}


//Unlike scream 

export const unlikeScream = (screamId) => dispatch =>{
    axios.get(`/scream/${screamId}/unlike`)
    .then(res=>{
        dispatch({
            type : UNLIKE_SCREAM,
            payload : res.data
        })
    })
    .catch(error=>console.log(error))
}

// submit comment
export const submitComment = (screamId,commentData) =>dispatch =>{
   
    axios.post(`/scream/${screamId}/comment`,commentData)
    .then(res=>{
        dispatch({
            type :SUBMIT_COMMENT,
            payload : res.data
        })
        dispatch(clearErrors())
    })
    .catch(error=>{
        dispatch({
            type : SET_ERRORS,
            payload : error.response.data
        })
    })
}

//deleteScream

export const deleteScream  = (screamId) => dispatch =>{
    axios.delete(`/scream/${screamId}`)
    .then(()=>{
        dispatch({
            type : DELETE_SCREAM,
            payload : screamId
        })
       
    })
    .catch(error=>console.log(error))
}
export const clearErrors = () => dispatch =>{
    dispatch({type : CLEAR_ERRORS})
}