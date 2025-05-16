import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from "../../../../utility/useClickOutside";

function Search() {
  const [toggleSearch, setToggleSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const domNode = useClickOutside(() => setToggleSearch(false));

  const handleSubmit = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/tour?destination=${encodeURIComponent(searchTerm.trim())}`);
      setToggleSearch(false);
    }
  };

  return (
    <div className="nav-search">
      <button
        className="far fa-search"
        onClick={() => setToggleSearch(!toggleSearch)}
      />
      <form onSubmit={handleSubmit} className={toggleSearch ? "" : "hide"} ref={domNode}>
        <input
          type="text"
          placeholder="Tìm kiếm điểm đến"
          className="searchbox"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          required
        />
        <button type="submit" className="searchbutton far fa-search" />
      </form>
    </div>
  );
}

export default Search;