import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Topbar.css"; // Assuming the CSS is in this file

function SearchBar({ boardName, boardId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const searchMessages = async () => {
      if (searchTerm !== "") {
        try {
          const response = await axios.get(
            `/api/search/${boardId}?q=${searchTerm}`
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error fetching search results", error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };

    const delayDebounce = setTimeout(() => {
      searchMessages();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, boardId]);

  return (
    <div className="search-bar">
      <input
        type="search"
        className="search-input" // Added class name for styling
        placeholder={`Search ${boardName}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="search-results">
        {searchResults.map((result) => (
          <div key={result._id} className="search-item">
            {" "}
            {/* Added class name for styling */}
            <p className="search-content">{result.content}</p>{" "}
            {/* Added class name for styling */}
            <p className="search-creator">
              {result.creatorDetails.firstName} {result.creatorDetails.lastName}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
