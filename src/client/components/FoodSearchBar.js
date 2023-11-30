import React, { useState } from "react";

function FoodSearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [servingSize, setServingSize] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex justify-center items-center mt-4"
    >
      <input
        type="number"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Barcode"
        className="w-1/4 py-2 mx-2 border rounded border-gray-300 text-center rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="number"
        value={servingSize}
        onChange={(e) => setServingSize(e.target.value)}
        placeholder="Serving Size"
        className="w-1/4 py-2 mx-2 border rounded border-gray-300 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <button
        type="submit"
        className="w-1/8 mx-2 border rounded border-blue-500 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md"
      >
        Search
      </button>
    </form>
  );
}

export default FoodSearchBar;
