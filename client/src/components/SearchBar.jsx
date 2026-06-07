import React from 'react';

// Search input field with embedded search icon
export const SearchBar = ({ value, onChange, placeholder }) => {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
    }}>
      <div style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        {/* Search Magnifying Lens Vector */}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </div>
      <input
        type="text"
        className="glass-input"
        placeholder={placeholder || "Search jobs by title, company, or keywords..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          paddingLeft: '45px',
          height: '50px',
          fontSize: '15px',
          borderRadius: 'var(--border-radius-sm)',
        }}
      />
    </div>
  );
};

export default SearchBar;
