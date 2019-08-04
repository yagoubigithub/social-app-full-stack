import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom/";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyButton from '../util/MyButton';

//  Mui staff
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

//Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

//icons
import ChatIcon  from '@material-ui/icons/Chat'
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
const styles = {
  card: {
    display: "flex",
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: "cover"
  }
};

class Scream extends Component {
  likedScream = () =>{
    if(this.props.user.likes   && this.props.user.likes.find(like=>like.screamId === this.props.scream.screamId))
      return true;
    else return false;
  }
  likeScream = ( )=>{
    this.props.likeScream(this.props.scream.screamId);
  }
  unlikeScream = ( )=>{
    this.props.unlikeScream(this.props.scream.screamId);
  }
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      scream: {
        body,
        commentCount,
        createdAt,
        userHandle,
        userImage,
        likeCount
      },
      user :{
        authenticated
      }
    } = this.props;
    const likeButton = !authenticated ? (
      <MyButton tip="Like">
      <Link to="/login" >
        <FavoriteBorder color="secondary" />
      </Link>

      </MyButton>
    ) : 
   (
     this.likedScream() ? (
      <MyButton tip="Undo like" onClick={this.unlikeScream}>
        <FavoriteIcon color="secondary" />
      </MyButton>
     ) : 
     <MyButton tip="like" onClick={this.likeScream}>
     
     <FavoriteBorder color="secondary" />
 

   </MyButton>
   );

    return (
      <Card className={classes.card}>
        <CardMedia image={userImage} className={classes.image} />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            component={Link}
            to={`/users/${userHandle}`}
            color="primary"
          >
            {userHandle}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          {likeButton}
          <span>{likeCount} likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
        </CardContent>
      </Card>
    );
  }
}
Scream.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  user : PropTypes.object.isRequired
};
const mapActionsToProps = dispatch => ({
  likeScream: screamId => dispatch(likeScream(screamId)),
  unlikeScream: screamId => dispatch(unlikeScream(screamId))
});
const mapStateToProps = state =>({

  user : state.user
})

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(Scream));
