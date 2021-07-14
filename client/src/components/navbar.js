import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../App";
import { useHistory } from "react-router";
const NavBar = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(userContext);
  const render = () => {
    if (state) {
      return [
        <li>
          <Link to="/home">Home</Link>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <Link to="/newpost">New Post</Link>
        </li>,
        <li>
          <button
            className="btn waves-effect waves-light"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/login");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
        <Link to="/signup">Signup</Link>
      </li>
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={state ? "/" : "/login"} className="brand-logo left">
          Photogram
        </Link>
        <ul id="nav-mobile" className="right">
          {render()}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
