import './App.css';
import React, { useState } from 'react';
import FoodSearchBar from './components/FoodSearchBar';

function App() {
  const [products, setProducts] = useState([]);

  const handleSearch = async (barcode) => {
    const url = `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`;
  
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts([data.product]); // The API returns a single product, so wrap it in an array
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle the error, e.g., set an error message state and display it
    }
  };

  return (
    <div>
      <FoodSearchBar onSearch={(handleSearch)} />
      {/* Display search results here */}
    </div>
  );
}

export default App;
