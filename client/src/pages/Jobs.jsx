import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/api';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';
import { JobCardSkeleton } from '../components/Loader';
import EmptyState from '../components/EmptyState';

// Main Jobs Board / Listings Search page
export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter state values
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    sortBy: 'newest'
  });

  // Query jobs from backend using search, location, and type filters
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (search) params.search = search;
      if (filters.location) params.location = filters.location;
      if (filters.jobType) params.type = filters.jobType;

      const data = await getJobs(params);
      
      // Perform local sorting based on SortBy criteria
      let sortedJobs = [...data];
      if (filters.sortBy === 'salary-desc') {
        sortedJobs.sort((a, b) => b.salary - a.salary);
      } else if (filters.sortBy === 'salary-asc') {
        sortedJobs.sort((a, b) => a.salary - b.salary);
      } else {
        // Default: Sort newest first (matches creation timestamps)
        sortedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      setJobs(sortedJobs);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Could not load jobs list from the API. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch listing records whenever search filter properties update (with brief debounce)
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, filters.location, filters.jobType, filters.sortBy]);

  // Update specific criteria inside filter state
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all search details to default
  const handleResetFilters = () => {
    setSearch('');
    setFilters({
      location: '',
      jobType: '',
      sortBy: 'newest'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Explore <span className="gradient-text-accent">Opportunities</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Browse open listings and apply to modern tech opportunities immediately.
        </p>
      </div>

      {/* Grid: Filter sidebar + listings */}
      <div className="jobs-layout-grid" style={{
        display: 'grid',
        gridTemplateColumns: '300px 1fr',
        gap: '30px',
        alignItems: 'start'
      }}>
        
        {/* Sticky filter panel */}
        <div className="jobs-sidebar">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Search bar and job listings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SearchBar value={search} onChange={setSearch} />

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '16px',
              color: 'var(--danger-color)',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {loading ? (
            <div className="jobs-cards-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {Array.from({ length: 6 }).map((_, idx) => (
                <JobCardSkeleton key={idx} />
              ))}
            </div>
          ) : jobs.length > 0 ? (
            <div className="jobs-cards-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          ) : (
            <EmptyState
              message="No jobs match your search queries or active filters. Try adjusting your parameters or clear them."
              actionText="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>

      {/* Mobile breakpoint layout overrides */}
      <style>{`
        @media (max-width: 900px) {
          .jobs-layout-grid {
            grid-template-columns: 1fr !important;
          }
          .jobs-sidebar {
            position: relative !important;
          }
          .jobs-sidebar > div {
            position: relative !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Jobs;
