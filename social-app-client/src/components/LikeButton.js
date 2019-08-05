import React, { Component } from "react";
import PropTypes from "prop-types";
import MyButton from "../util/MyButton";
import { Link } from "react-router-dom";

//Redux
import { connect } from "react-redux";
import { likeScream, unlikeScream } from "../redux/actions/dataActions";

//icons
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";

class LikeButton extends Component {
  likedScream = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.screamId === this.props.screamId)
    )
      return true;
    else return false;
  };
  likeScream = () => {
    this.props.likeScream(this.props.screamId);
  };
  unlikeScream = () => {
    this.props.unlikeScream(this.props.screamId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = !authenticated ? (
      <Link to="/login">
        <MyButton tip="Like">
          <FavoriteBorder color="secondary" />
        </MyButton>
      </Link>
    ) : this.likedScream() ? (
      <MyButton tip="Undo like" onClick={this.unlikeScream}>
        <FavoriteIcon color="secondary" />
      </MyButton>
    ) : (
      <MyButton tip="like" onClick={this.likeScream}>
        <FavoriteBorder color="secondary" />
      </MyButton>
    );
    return likeButton;
  }
}
LikeButton.propTypes = {
  likeScream: PropTypes.func.isRequired,
  unlikeScream: PropTypes.func.isRequired,
  screamId: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};
const mapActionsToProps = dispatch => ({
  likeScream: screamId => dispatch(likeScream(screamId)),
  unlikeScream: screamId => dispatch(unlikeScream(screamId))
});
const mapStateToProps = state => ({
  user: state.user
});
export default connect(
  mapStateToProps,
  mapActionsToProps
)(LikeButton);
