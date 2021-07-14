import React from 'react';
import NavBar  from './components/navbar';
import "./App.css";
import {BrowserRouter, Route, Switch, useHistory} from 'react-router-dom';
import Home from './components/pages/home'
import Login from './components/pages/login'
import Signup from './components/pages/signup'
import Profile from './components/pages/profile'
import NewPost from './components/pages/newpost'
import {useEffect} from 'react';
import {createContext, useReducer, useContext} from 'react';
import { initState, reducer } from './reducers/userReducer';

export const userContext = createContext();

const Routes= () => {
  const history = useHistory();
  const {state, dispatch} = useContext(userContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type: "USER", payload: user})
      //history.push('/')
    } else {
      history.push('/login')
    }
  },[])
  return(
    <Switch>
        <Route exact path="/">
      <Home />
      </Route>
      <Route path="/home">
        <Home /> 
      </Route>
      <Route path="/signup">
        <Signup /> 
      </Route>
      <Route path="/login">
        <Login /> 
      </Route>
      <Route path="/profile">
        <Profile /> 
      </Route>
      <Route path="/newpost">
        <NewPost /> 
      </Route>
    </Switch>
  )
}


function App() {
  const [state, dispatch] = useReducer(reducer, initState);
  return (
    <userContext.Provider value = {{state:state, dispatch:dispatch}}>
    <BrowserRouter>
      <NavBar />
      <Routes />
    </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
