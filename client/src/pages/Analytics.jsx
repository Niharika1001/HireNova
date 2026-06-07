import React, { useState, useEffect } from 'react';
import { getJobs, getApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';

export const Analytics = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const jobsData = await getJobs({ recruiterId: user._id });
        setJobs(jobsData);
        
        const appsData = await getApplications();
        setApplications(appsData);
      } catch (err) {
        console.error('Error fetching analytics details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalyticsData();
    }
  }, [user]);

  if (loading) return <Loader />;

  // 1. Open Positions
  const openPositionsCount = jobs.filter(j => j.status === 'Open').length;

  // 2. Applications This Month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const appsThisMonth = applications.filter(app => {
    const date = new Date(app.createdAt);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  }).length;

  // 3. Most Applied Job
  const jobAppCounts = {};
  applications.forEach(app => {
    const title = app.jobId?.title || 'Unknown Position';
    jobAppCounts[title] = (jobAppCounts[title] || 0) + 1;
  });

  let mostAppliedJobTitle = 'N/A';
  let mostAppliedJobCount = 0;
  Object.keys(jobAppCounts).forEach(title => {
    if (jobAppCounts[title] > mostAppliedJobCount) {
      mostAppliedJobTitle = title;
      mostAppliedJobCount = jobAppCounts[title];
    }
  });

  // 4. Hiring Success Rate (Selected / Total processed apps, e.g. Selected + Rejected)
  const selectedCount = applications.filter(app => app.status === 'Selected').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const processedCount = selectedCount + rejectedCount;
  const hiringSuccessRate = processedCount > 0 ? Math.round((selectedCount / processedCount) * 100) : 0;

  // 5. Monthly Trend points (Mocking points based on real month distribution)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyCounts = Array(12).fill(0);
  applications.forEach(app => {
    const month = new Date(app.createdAt).getMonth();
    monthlyCounts[month]++;
  });

  // Take the last 6 months to construct the trend line
  const trendLabels = [];
  const trendValues = [];
  for (let i = 5; i >= 0; i--) {
    const m = (currentMonth - i + 12) % 12;
    trendLabels.push(monthNames[m]);
    trendValues.push(monthlyCounts[m]);
  }

  // Calculate SVG line points
  const maxVal = Math.max(...trendValues, 5); // default min height scale of 5
  const svgWidth = 500;
  const svgHeight = 160;
  const points = trendValues.map((val, idx) => {
    const x = (idx / 5) * (svgWidth - 40) + 20;
    const y = svgHeight - (val / maxVal) * (svgHeight - 40) - 20;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Recruiting <span className="gradient-text-accent">Analytics</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Analyze recruitment performance, monthly pipeline metrics, and hiring ratios.
        </p>
      </div>

      {/* Stats Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="metric-label" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
            Applications This Month
          </span>
          <h2 className="metric-value" style={{ fontSize: '36px', fontWeight: '800', color: 'var(--primary-color)' }}>
            {appsThisMonth}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Currently in {monthNames[currentMonth]}</span>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="metric-label" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
            Hiring Success Rate
          </span>
          <h2 className="metric-value" style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-color)' }}>
            {hiringSuccessRate}%
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{selectedCount} selected / {processedCount} finalized</span>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="metric-label" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
            Open Positions
          </span>
          <h2 className="metric-value" style={{ fontSize: '36px', fontWeight: '800', color: 'var(--success-color)' }}>
            {openPositionsCount}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Actively receiving resumes</span>
        </div>

        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span className="metric-label" style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
            Most Applied Job
          </span>
          <h2 className="metric-value" style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '16px' }}>
            {mostAppliedJobTitle}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--primary-color)', fontWeight: '600' }}>{mostAppliedJobCount} submissions received</span>
        </div>
      </div>

      {/* Visual Charts section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }} className="analytics-charts-grid">
        
        {/* Trend line chart (Applications Trend) */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Submission Pipeline Trend</h3>
          
          <div style={{ position: 'relative', width: '100%' }}>
            {/* SVG Line Chart */}
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ width: '100%', height: 'auto', overflow: 'visible' }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-color)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--primary-color)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {/* Grid Lines */}
              <line x1="20" y1="20" x2={svgWidth - 20} y2="20" stroke="var(--card-border)" strokeWidth="0.5" />
              <line x1="20" y1="60" x2={svgWidth - 20} y2="60" stroke="var(--card-border)" strokeWidth="0.5" />
              <line x1="20" y1="100" x2={svgWidth - 20} y2="100" stroke="var(--card-border)" strokeWidth="0.5" />
              <line x1="20" y1="140" x2={svgWidth - 20} y2="140" stroke="var(--card-border)" strokeWidth="0.5" />

              {/* Area fill */}
              {points && (
                <path
                  d={`M 20,140 L ${points} L ${trendValues.length > 0 ? (trendValues.length - 1) / 5 * (svgWidth - 40) + 20 : 20},140 Z`}
                  fill="url(#chartGradient)"
                />
              )}

              {/* Trend line */}
              {points && (
                <polyline
                  fill="none"
                  stroke="var(--primary-color)"
                  strokeWidth="3.5"
                  points={points}
                  style={{ filter: 'drop-shadow(0px 4px 10px rgba(0, 212, 255, 0.4))' }}
                />
              )}

              {/* Data points dots */}
              {trendValues.map((val, idx) => {
                const x = (idx / 5) * (svgWidth - 40) + 20;
                const y = svgHeight - (val / maxVal) * (svgHeight - 40) - 20;
                return (
                  <g key={idx}>
                    <circle cx={x} cy={y} r="5" fill="#050816" stroke="var(--primary-color)" strokeWidth="2.5" />
                    <text x={x} y={y - 10} textAnchor="middle" fill="var(--text-color)" fontSize="10" fontWeight="700">
                      {val}
                    </text>
                  </g>
                );
              })}
            </svg>
            
            {/* Axis labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 10px 0 10px', fontSize: '11px', color: 'var(--text-muted)' }}>
              {trendLabels.map((label, idx) => (
                <span key={idx} style={{ flex: 1, textAlign: 'center' }}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Funnel distribution chart */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', fontFamily: 'var(--font-display)', width: '100%', textAlign: 'left' }}>
            Application Pipeline
          </h3>

          <div style={{ position: 'relative', width: '130px', height: '130px', display: 'flex', alignItems: 'center', justifycontent: 'center' }}>
            {/* SVG circle meter */}
            <svg width="130" height="130" viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--card-border)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.915"
                fill="none"
                stroke="var(--accent-color)"
                strokeWidth="3.5"
                strokeDasharray={`${hiringSuccessRate} ${100 - hiringSuccessRate}`}
                strokeLinecap="round"
                style={{ filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.4))' }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}>
              <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-color)', fontFamily: 'var(--font-display)' }}>
                {hiringSuccessRate}%
              </span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '600' }}>Success</span>
            </div>
          </div>

          {/* Breakdown description legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--info-color)', display: 'inline-block' }} />
                <span>Applied</span>
              </div>
              <span style={{ fontWeight: '700' }}>{applications.filter(a => a.status === 'Applied').length}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--purple-color)', display: 'inline-block' }} />
                <span>Under Review</span>
              </div>
              <span style={{ fontWeight: '700' }}>{applications.filter(a => a.status === 'Reviewed').length}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning-color)', display: 'inline-block' }} />
                <span>Interviewing</span>
              </div>
              <span style={{ fontWeight: '700' }}>{applications.filter(a => a.status === 'Interview Scheduled').length}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success-color)', display: 'inline-block' }} />
                <span>Selected</span>
              </div>
              <span style={{ fontWeight: '700' }}>{selectedCount}</span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-charts-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
