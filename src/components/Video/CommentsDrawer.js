/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useContext } from "react";
import { Close, AccountCircle, Send } from "@material-ui/icons";
import CommentWrapper, { ProfilePic } from "./CommentWrapper";
import Moralis from "moralis";
import { AppCtx } from "./../../App";

const CommentsDrawer = ({
  video,
  comments,
  allComments,
  getComments,
  isCommentsOpen,
  setIsCommentsOpen,
}) => {
  const { currentUser } = useContext(AppCtx);
  const { data, status } = isCommentsOpen;
  const [commentText, setCommentText] = useState("");
  const [isReply, setIsReply] = useState({ commentId: "", status: false });
  const [loading, setLoading] = useState(false);

  let textarea = document.getElementById("comment-input");

  useEffect(() => {
    !isCommentsOpen.status && setIsReply({ commentId: "", status: false });
  }, [isCommentsOpen]);

  useEffect(() => {
    let textarea = document.getElementById("comment-input");
    isReply.status && textarea.focus();
  }, [isReply]);

  useEffect(() => {
    textarea && handleExpand();
  }, [textarea]);

  const handlePostComment = async () => {
    setLoading(true)
    const comment = new Moralis.Object("Comments");
    const commentData = isReply.status
      ? {
          postId: data.data ? data.data.id : data.id,
          commentedBy: currentUser[0].id,
          comment: commentText,
          repliedTo: isReply.commentId,
        }
      : {
          postId: data.data ? data.data.id : data.id,
          commentedBy: currentUser[0].id,
          comment: commentText,
        };

    await comment.save(commentData).then(
      (com) => {
        getComments();
        setCommentText("");
        setIsReply({ commentId: null, status: false });
        let textarea = document.getElementById("comment-input");
        textarea.setAttribute("rows", "1");
        setLoading(false)
      },
      (error) => {
        console.log({ error });
      }
    );
  };

  const handleExpand = () => {
    const limitRows = 5;

    let messageLastScrollHeight = textarea.scrollHeight;
    let rows = parseInt(textarea.getAttribute("rows"));
    textarea.addEventListener("keyup", () => {
      const scrollHeight = textarea.scrollHeight;
      textarea.setAttribute("rows", "1");
      // setRow(rows);

      if (rows < limitRows && scrollHeight > messageLastScrollHeight) {
        rows++;
      } else if (rows > 1 && scrollHeight < messageLastScrollHeight) {
        rows--;
      }

      messageLastScrollHeight = scrollHeight;
      textarea.setAttribute("rows", rows);
    });
  };

  return (
    <section
      className={`comments-drawer${
        isCommentsOpen.status ? " open-comments-drawer" : ""
      }`}
    >
      <div className="comment-top">
        <sup>
          {status ? allComments.length : 0} comment
          {`${allComments.length > 1 ? "s" : ""}`}
        </sup>
        <Close
          className="comments-drawer-close-btn"
          onClick={() => {
            setIsCommentsOpen({ data: null, status: false });
          }}
        />
      </div>

      <article>
        {comments ? (
          comments.map((comment) => {
            return (
              <CommentWrapper
                key={comment.main_comment.comment.id}
                commentData={comment}
                setIsReply={setIsReply}
                video={video}
              />
            );
          })
        ) : (
          <span style={{ textAlign: "center" }}>No Comment yet.</span>
        )}
      </article>

      <div className="comment-input-wrapper">
        {video.length > 0 ? (
          <ProfilePic user={currentUser[0]?.attributes.profilePicture} />
        ) : (
          <AccountCircle className="" />
        )}
        <textarea
        disabled={loading}
          id="comment-input"
          placeholder={
            isReply.status ? "Write your reply..." : "Write a comment..."
          }
          className="comment-input"
          rows={1}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value.trimStart())}
        />
        {
          commentText && !loading ? <Send className="comment-send" onClick={handlePostComment} /> : <Send className="comment-send" style={{color: '#eee'}}/>
        }
      </div>
    </section>
  );
};

export default CommentsDrawer;