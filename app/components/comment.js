import React from 'react';
import {unixTimeToString} from '../util.js'
import {Link} from 'react-router';
import {likeComment, unlikeComment} from '../server.js'

export default class Comment extends React.Component {

  constructor(props) {
    super(props);
    this.state =  this.props.data;
  }

  /**
   * Triggered when the user clicks on the 'like'
   * or 'unlike' button.
   */
  handleLikeClick(clickEvent) {
  // Stop the event from propagating up the DOM
  // tree, since we handle it here. Also prevents
  // the link click from causing the page to scroll to the top.
  clickEvent.preventDefault();
  // 0 represents the 'main mouse button' --
  // typically a left click
  // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button
  if (clickEvent.button === 0) {
    // Callback function for both the like and unlike cases.
    var callbackFunction = (updatedLikeCounter) => {
      this.setState({likeCounter: updatedLikeCounter});
    };
    if (this.didUserLike()) {
      // User clicked 'unlike' button.
      unlikeComment(this.props.feedItemId, 4, this.props.commentIndex, callbackFunction);
    } else {
      // User clicked 'like' button.
      likeComment(this.props.feedItemId, 4, this.props.commentIndex, callbackFunction);
  } }
  }
  /**
  * Returns 'true' if the user liked the item.
  * Returns 'false' if the user has not liked the item.
  */
  didUserLike() {
  var likeCounter = this.state.likeCounter;
  var liked = false;
  // Look for a likeCounter entry with userId 4 -- which is the
  // current user.
  for (var i = 0; i < likeCounter.length; i++) {
    if (likeCounter[i] === 4) {
      liked = true;
      break;
  } }
  return liked;
  }

  render() {
    var likeCommentText = "Like"
    var likeCountText = "";
    var thumbsUp, dot;
    if(this.didUserLike()) {
      likeCommentText = "Unlike";
    }

    if(this.state.likeCounter.length > 0){
      dot = (
        <span> · </span>
      );
      thumbsUp = (
        <span className="glyphicon glyphicon-thumbs-up"></span>
      );
      likeCountText = '(' + this.state.likeCounter.length + ')';
    }else{
      dot = null;
      thumbsUp = null;
    }

    return (
      <div>
        <div className="media-left media-top">
          PIC
        </div>
        <div className="media-body">
        <Link to={"/profile/" + this.state.author._id}>
          {this.state.author.fullName}
        </Link> {this.props.children}
        <br />
        <a href="#" onClick={(e) => this.handleLikeClick(e)}>{likeCommentText}</a> ·
        <a href="#"> Reply</a>
        {dot}{thumbsUp}
        <span>{likeCountText} · </span>
        {unixTimeToString(this.state.postDate)}
        </div>
      </div>
    )
  }
}
