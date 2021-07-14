import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import M from "materialize-css";

const NewPost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer: " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title: title,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828 red darken-3" });
          } else {
            M.toast({
              html: "Uploaded Successfully",
              classes: "#43a047 green darken-1",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url]);
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "photogram");
    data.append("cloud_name", "projectsamarth");
    fetch("https://api.cloudinary.com/v1_1/projectsamarth/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="card input-file"
      style={{
        margin: "50px auto",
        maxWidth: "400px",
        padding: "20px",
        height: "500px",
      }}
    >
      <h2> Upload a Photo </h2>
      <div className="file-field input-field">
        <div className="btn">
          <span>File</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <input
        type="text"
        placeholder="Enter Caption"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        className="btn waves-effect waves-light"
        style={{
          marginTop: "50px",
        }}
        onClick={() => postDetails()}
      >
        Upload
      </button>
    </div>
  );
};

export default NewPost;
