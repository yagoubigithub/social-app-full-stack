import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import PropTypes from "prop-types";
import { Link } from "react-router-dom/";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import MyButton from '../util/MyButton';
import DeleteScream from './DeleteScream';
import ScreamDialog from './ScreamDialog';

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
import LikeButton from "./LikeButton";

const styles = {
  card: {
    display: "flex",
    marginBottom: 20,
    position : 'relative'
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
        likeCount,
        screamId
      },
      user :{
        authenticated,
        credentials : {handle}
      }
    } = this.props;
   

   const deleteButton = authenticated && userHandle === handle ? 
   (
<DeleteScream screamId={screamId} />
   ) : null;
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
          {deleteButton}
          <Typography variant="body2" color="textSecondary">
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant="body1">{body}</Typography>
          <LikeButton screamId={screamId} />
          <span>{likeCount} likes</span>
          <MyButton tip="comments">
            <ChatIcon color="primary" />
          </MyButton>
          <span>{commentCount} comments</span>
          <ScreamDialog screamId={screamId} userHandle={userHandle} />
        </CardContent>
      </Card>
    );
  }
}
Scream.propTypes = {
  
  user : PropTypes.object.isRequired
};

const mapStateToProps = state =>({

  user : state.user
})

export default connect(
  mapStateToProps
)(withStyles(styles)(Scream));
