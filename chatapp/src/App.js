import React from 'react';
import "./App.css";
import socketIO from "socket.io-client";
import {Route, Routes} from "react-router-dom";
import Join from "./components/Join/Join";
import Chat from './components/Chat/Chat';

const App = () => {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Join/>}></Route>
        <Route exact path="/chat" element={<Chat/>}></Route>
      </Routes>
    </>
  )
}

export default App;