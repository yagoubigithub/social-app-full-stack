import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM
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