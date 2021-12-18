import React from "react";

const VideoCaption = ({ details }) => {
  return (
    <div className="video-caption">
      <span>
        @
        {details[0]?.user ||
          details?.attributes?.createdByUser ||
          details[0]?.data?.attributes.createdByUser}
      </span>
      <p>
        {details[0]?.data.attributes.description ||
          details.attributes.description}
      </p>
    </div>
  );
};

export default VideoCaption;
