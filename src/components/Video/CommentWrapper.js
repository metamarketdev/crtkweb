/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  AccountCircle,
  KeyboardArrowDown,
  FavoriteBorder,
} from "@material-ui/icons";

const DateConverter = (date) => {
  return date?.toISOString("MM-DD-YYYY").split("T")[0];
};

// TODO: Main Comment
const CommentWrapper = ({ commentData, setIsReply, video }) => {
  const { main_comment, replies } = commentData;
  const { comment, user } = main_comment;

  return (
    <section className="comment-wrapper">
      <ProfilePic user={user} />

      <div>
        <span className="username">@{user?.attributes.username}</span>
        <p className="body">{comment?.attributes.comment}</p>

        <p className="date">
          {DateConverter(comment?.attributes.createdAt)}{" "}
          <strong
            onClick={() =>
              setIsReply({
                commentId: comment?.id,
                status: true,
              })
            }
          >
            Reply
          </strong>
        </p>
        <Replies replies={replies} id={comment?.id} commentData={commentData} />
      </div>

      <div className="likes">
        <FavoriteBorder />
        <p>{comment?.attributes.likedBy?.length}</p>
      </div>
    </section>
  );
};

// TODO: Replies
const Replies = ({ replies, id, commentData }) => {
  const [isOpen, setIsOpen] = useState(false);

  const wrapper = document.getElementById(`replies-wrapper-${id}`);
  useEffect(() => {
    wrapper && handleCollapse();
  }, [isOpen, wrapper]);

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
      setTimeout(() => {
        setIsOpen(true);
      }, 100);
    }
  }, [commentData]);

  const handleCollapse = () => {
    wrapper.style.maxHeight = isOpen ? `${wrapper?.scrollHeight}px` : 0;
  };

  return (
    <section className="replies">
      <div onClick={() => setIsOpen((isOpen) => !isOpen)}>
        View replies ({replies.length}){" "}
        <KeyboardArrowDown className={`reply-icon${isOpen ? " open" : ""}`} />
      </div>

      <div
        id={`replies-wrapper-${id}`}
        className={`replies-wrapper${isOpen ? " replies-open" : ""}`}
      >
        {replies.map((reply) => {
          return <Comment key={reply.comment.id} reply={reply} />;
        })}
      </div>
    </section>
  );
};

// TODO: Reply
const Comment = ({ reply }) => {
  const { user, comment } = reply;

  return (
    <section className="comment-wrapper">
      <ProfilePic user={user} />
      <div>
        <span className="username">@{user?.attributes.username}</span>
        <p className="body">{comment?.attributes.comment}</p>

        <p className="date">{DateConverter(comment?.attributes.createdAt)}</p>
      </div>

      <div className="likes">
        <FavoriteBorder />
        <p>{comment?.attributes.likedBy?.length}</p>
      </div>
    </section>
  );
};

export const ProfilePic = ({ user }) => {
  return user !== undefined && user ? (
    <section className="profile-pic-wrapper">
      <img
        src={user?.attributes?.profilePicture || user}
        alt={`${user?.attributes?.username || user}`}
      />
    </section>
  ) : (
    <AccountCircle />
  );
};

export default CommentWrapper;
