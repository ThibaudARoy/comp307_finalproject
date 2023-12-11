import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Topbar/Topbar.css";

function SearchBar({ boardName, boardId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchBarFocused, setIsSearchBarFocused] = useState(false);

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
        onFocus={() => setIsSearchBarFocused(true)}
        onBlur={() => setIsSearchBarFocused(false)}
      />
      {isSearchBarFocused && searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((result) => (
            <div key={result._id} className="search-item">
              {" "}
              {/* Added class name for styling */}
              <p className="search-content">"{result.content}"</p>{" "}
              {/* Added class name for styling */}
              <p className="search-creator">
                by{" "}
                <span className="messageCreator">
                  {result.creatorDetails.firstName}{" "}
                  {result.creatorDetails.lastName}</span> on{" "}
                  <span className="messageCreator">{result.formattedTimestamp} </span> 
                  in <span className="messageCreator">#{result.channelName}</span> 

              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
