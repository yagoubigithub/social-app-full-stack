import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom/";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

//Mui stuff
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

//icons
import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

//redux
import { connect } from "react-redux";
import { markNotificationsRead } from "../../redux/actions/userActions";

//firebase
import db from "../../config/fbConfig";

class Notifications extends Component {
  state = {
    anchorEl: null,
    notifications: []
  };
  handleOpen = event => {
    this.setState({
      anchorEl: event.target
    });
  };
  handleClose = () => {
    this.setState({ anchorEl: null });
  };
  onMenuOpened = () => {
    let unreadnotifcatinIds = this.props.notifications
      .filter(not => not.read === false)
      .map(not => not.notificationId);
    this.props.markNotificationsRead(unreadnotifcatinIds);
  };

  componentWillReceiveProps = nextProps => {
    this.setState({ notifications: nextProps.user.notifications });
    db.collection("notifications")
      .where("recipient", "==", nextProps.user.credentials.handle)
      .where("read", "==", false)
      .orderBy("createdAt", "desc")
      .onSnapshot(
        snapshot => {
          const notifications = [...this.state.notifications];
    
          snapshot.docChanges().forEach(change=>{
            if (change.type === "added") {
              if(notifications.length > 0){
                const newNotDate = new Date(change.doc.data().createdAt);
                const oldNotDate = new Date(notifications[0].createdAt);
                if (newNotDate > oldNotDate) {
                  notifications.unshift(change.doc.data());
                }
                console.log(change.doc.data());
              }else{
               
                  notifications.unshift(change.doc.data());
                
              }
             
          }
          });
          this.setState({ notifications });
          console.log(this.state.notifications);
          /*
          snapshot.docChanges(change => {
            if (change.type === "added") {
              snapshot.forEach(doc => {
                const newNotDate = new Date(doc.data().createdAt);
                const oldNotDate = new Date(notifications[0].createdAt);
                if (newNotDate > oldNotDate) {
                  notifications.unshift(doc.data());
                }
                console.log(doc.data());
              });
              this.setState({ notifications });
              console.log(this.state.notifications);
            }
          });*/
        },
        error => {
          console.log(error);
        }
      );
  };
  render() {
    const notifications = this.state.notifications;
    const anchorEl = this.state.anchorEl;
    let notificationIcon = <NotificationsIcon />;
    dayjs.extend(relativeTime);

    if (notifications && notifications.length > 0) {
      notifications.filter(not => not.read === false).length > 0
        ? (notificationIcon = (
            <Badge
              badgeContent={
                notifications.filter(not => not.read === false).length
              }
              color="secondary"
            >
              <NotificationsIcon />
            </Badge>
          ))
        : (notificationIcon = <NotificationsIcon />);
    } else {
      notificationIcon = <NotificationsIcon />;
    }
    let notificationsMarkup =
      notifications && notifications.length > 0 ? (
        notifications.map(not => {
          const verb = not.type === "like" ? "liked" : "commented on";
          const time = dayjs(not.createdAt).fromNow();
          const iconColor = not.read ? "primary" : "secondary";
          const icon =
            not.type === "like" ? (
              <FavoriteIcon color={iconColor} style={{ marginLeft: 10 }} />
            ) : (
              <ChatIcon color={iconColor} style={{ marginLeft: 10 }} />
            );
          return (
            <MenuItem key={not.createdAt} onClick={this.handleClose}>
              {icon}
              <Typography
                component={Link}
                variant="body1"
                to={`/users/${not.recipient}/scream/${not.screamId}`}
              >
                {not.sender} {verb} your scream {time}
              </Typography>
            </MenuItem>
          );
        })
      ) : (
        <MenuItem onClick={this.handleClose}>
          you have no notifications yat
        </MenuItem>
      );
    return (
      <Fragment>
        <Tooltip placeholder="top" title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.handleOpen}
          >
            {notificationIcon}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          onEntered={this.onMenuOpened}
        >
          {notificationsMarkup}
        </Menu>
      </Fragment>
    );
  }
}
Notifications.propTypes = {
  markNotificationsRead: PropTypes.func.isRequired,
  notifications: PropTypes.array.isRequired
};
const mapActionsToProps = dispatch => ({
  markNotificationsRead: notificationIds =>
    dispatch(markNotificationsRead(notificationIds))
});
const mapStateToProps = state => ({
  notifications: state.user.notifications,
  handle: state.user.credentials.handle,
  user: state.user
});
export default connect(
  mapStateToProps,
  mapActionsToProps
)(Notifications);
