import logo from './logo.svg';
import axios from 'axios';
import './App.css';
import React, { useState } from 'react';
import MovieSearch from './Component/MovieSearch.jsx';

function App() {
  return (
    <div>
      <MovieSearch/>
    </div>
  );
}

export default App;
