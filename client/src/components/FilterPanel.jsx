import React from 'react';

// Sticky panel holding all Job search filters and sorting controllers
export const FilterPanel = ({ filters, onFilterChange, onReset }) => {
  const jobTypes = ['All', 'Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'];

  return (
    <div className="glass-card" style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      height: 'fit-content',
      position: 'sticky',
      top: '95px', // Offset from the sticky navbar
    }}>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', fontFamily: 'var(--font-display)' }}>Filters</h3>
        <button
          onClick={onReset}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--accent-primary)',
            fontSize: '12px',
            cursor: 'pointer',
            textTransform: 'uppercase',
            fontWeight: '600',
            letterSpacing: '0.05em'
          }}
        >
          Reset All
        </button>
      </div>

      {/* Filter by Location */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Location</label>
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          </div>
          <input
            type="text"
            className="glass-input"
            placeholder="e.g. New York, Remote"
            value={filters.location}
            onChange={(e) => onFilterChange('location', e.target.value)}
            style={{ paddingLeft: '34px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Filter by Job Type */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Job Type</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {jobTypes.map((type) => {
            const isSelected = filters.jobType === type || (type === 'All' && !filters.jobType);
            return (
              <button
                key={type}
                onClick={() => onFilterChange('jobType', type === 'All' ? '' : type)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: isSelected ? '1px solid var(--accent-primary)' : '1px solid var(--card-border)',
                  background: isSelected ? 'rgba(6, 214, 255, 0.08)' : 'rgba(255,255,255,0.02)',
                  color: isSelected ? 'var(--accent-primary)' : 'var(--text-color)',
                  fontSize: '13px',
                  fontWeight: isSelected ? '600' : '400',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                }}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort Options */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label">Sort By</label>
        <select
          className="glass-input"
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          style={{
            fontSize: '13px',
            background: 'var(--bg-secondary)',
            cursor: 'pointer',
          }}
        >
          <option value="newest">Newest First</option>
          <option value="salary-desc">Salary: High to Low</option>
          <option value="salary-asc">Salary: Low to High</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;
