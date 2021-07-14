import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { userContext } from "../../App";
import { useHistory } from "react-router";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer: " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        setData(result.allPosts);
      });
  }, []);
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dislikePost = (id) => {
    fetch("/dislike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer: " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deletePost = (postid) => {
    fetch(`/deletePost/${postid}`, {
      method: "delete",
      headers: {
        "Authorization": "Bearer: " + localStorage.getItem("jwt"),
        "Accept" : "applciation/json "
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h6>
              {item.postedBy.name}
              {item.postedBy._id === state._id && (
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                    marginRight: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => deletePost(item._id)}
                >
                  delete
                </i>
              )}
            </h6>
            <div className="card-image">
              <img src={item.photo} alt="img" />
            </div>
            <div className="card-content">
              {item.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  style={{
                    marginLeft: "15px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    dislikePost(item._id);
                  }}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    likePost(item._id);
                  }}
                >
                  thumb_up
                </i>
              )}

              <p>{item.likes.length} Likes</p>
              <h6> {item.title} </h6>
             {/*<input type="text" placeholder="Add a comment.." /> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
