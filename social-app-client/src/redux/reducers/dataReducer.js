import {
    SET_SCREAMS,
    LOADING_DATA,
    LIKE_SCREAM,
    UNLIKE_SCREAM,
    DELETE_SCREAM,
    POST_SCREAM,
    SET_SCREAM,
    SUBMIT_COMMENT,
  } from "../types";

  const initialState = {
    screams :[]
  }
  export default function(state = initialState, action) {
      let i = 0;
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

            if(state.scream.screamId === action.payload.screamId){
                state.scream = {comments : state.scream.comments,...action.payload};
            }
            return {
                ...state
            }
        case DELETE_SCREAM : 
          i = state.screams.findIndex((scream)=> scream.screamId === action.payload);
             state.screams.splice(i, 1)  ;

            return {
                ...state
            }
        case POST_SCREAM :
            return {
                ...state,
                screams : [
                    action.payload,
                    ...state.screams
                ]
            }
       
        case SET_SCREAM :
        return {
            ...state,
            scream : action.payload,
        }
        case SUBMIT_COMMENT  :
          i = state.screams.findIndex(scream=>scream.screamId === action.payload.screamId);
          state.screams[i].commentCount++;
          state.scream.commentCount++;
            return {
                ...state,
                scream :{
                    ...state.scream,
                    comments : [action.payload,...state.scream.comments]
                }
                
            }
        default :
        return state;
    
      }
  } 