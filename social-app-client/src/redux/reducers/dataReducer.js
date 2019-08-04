import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM
  } from "../types";

  const initialState = {
    screams :[]
  }
  export default function(state = initialState, action) {
      switch(action.type){
          case LOADING_DATA :
              return {
                  ...state,
                  loading : true,   
              }
         case SET_SCREAMS :
             return{
                 ...state,
                 screams : action.payload,
                 loading : false
             }
        case UNLIKE_SCREAM :
        case LIKE_SCREAM :
            let index = state.screams.findIndex((scream)=> scream.screamId === action.payload.screamId);
            state.screams[index] = action.payload;

            return {
                ...state
            }
        case DELETE_SCREAM : 
         const i = state.screams.findIndex((scream)=> scream.screamId === action.payload);
             state.screams.splice(i, 1)  ;

            return {
                ...state
            }
        default :
        return state;
    
      }
  } 