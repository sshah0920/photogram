import React, { useState } from "react";
import { useEffect, useContext } from "react";
import { userContext } from "../../App";

const Profile = () => {
  const [profilePhotos, setProfilePhotos] = useState([]);
  const {state, dispatch} = useContext(userContext)
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer: " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setProfilePhotos(result.myPosts);
      });
  }, []);
  return (
    <div
      style={{
        maxWidth: "750px",
        margin: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src="https://e1.pngegg.com/pngimages/444/382/png-clipart-frost-pro-for-os-x-icon-set-now-free-contacts-male-profile.png"
            alt="User Profile Img"
          />
        </div>
        <div>
          <h4>{state? state.name : "Loading..."}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>40 Posts</h6>
            <h6>31 Followers</h6>
            <h6>71 Following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {profilePhotos.map((item) => {
          return <img  key={item._id} classname="item" src={item.photo}  alt={item.title} />;
        })}
      </div>
    </div>
  );
};

export default Profile;
