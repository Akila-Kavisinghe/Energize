import './App.css';
import React, { useState } from 'react';
import FoodSearchBar from './components/FoodSearchBar';

function App() {
  return (
    <div>
      <FoodSearchBar/>
      {/* Display search results here */}
    </div>
  );
}

export default App;
