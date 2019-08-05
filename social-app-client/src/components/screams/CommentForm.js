import React, { Component } from 'react'
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

//Mui staff
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';


//Redux
import { connect } from "react-redux";
import { submitComment } from "../../redux/actions/dataActions";

const styles = (theme) => {
    return {
      ...theme.spreadThis,

    }}
 class CommentForm extends Component {
     state = {
         body : '',
         errors : {}
     }
     componentWillReceiveProps(nextProps){
         if(nextProps.UI.errors){
             this.setState({errors : nextProps.UI.errors})
         }else if(nextProps.UI.errors === null){
            this.setState({errors : {}})
         }
         if(!nextProps.UI.errors && !nextProps.UI.loading){
            this.setState({
                body : ''
            })
         }
     }
     handleChange = event=>{
         this.setState({
             [event.target.name] : event.target.value
         })
     }
     handleSubmit = event =>{
         event.preventDefault();
         this.props.submitComment(this.props.screamId, {body : this.state.body})
        
     }
    render() {
        const {classes ,  authenticated} = this.props;
        const errors = this.state.errors;
        const commentFormMarkup  = authenticated ? (
            <Grid item sm={12} style={{textAlign :  'center'}}>
            <form onSubmit={this.handleSubmit}>
            <TextField
            name="body"
            type="text"
            label="Comment on Scram"
            error={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            helperText={errors.comment}
            className={classes.textField}

            />
            <Button type="submit" variant="contained" color="secondary"
            className={classes.button}>
            Submit

            </Button>

            </form>
            <hr className={classes.visibleSeparator} />

            </Grid>
        ) : null;
        return commentFormMarkup;
    }
}
CommentForm.propTypes = {
    classes : PropTypes.object.isRequired,
    UI : PropTypes.object.isRequired,
    authenticated : PropTypes.bool.isRequired,
    screamId : PropTypes.string.isRequired,
    
}

const mapActionsToProps = dispatch=>({
    submitComment : (screamId, commentData)=>dispatch(submitComment(screamId, commentData)),
    
})
const mapStateToProps = state =>({
UI : state.UI,
authenticated : state.user.authenticated
})

export default  connect(mapStateToProps,mapActionsToProps)(withStyles(styles) (CommentForm))
