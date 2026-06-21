import React, { useState, useEffect } from 'react';
import { getJobs, getApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/Loader';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell, 
  LabelList 
} from 'recharts';

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

  // 1. Job metrics
  const totalJobsCount = jobs.filter(j => j.status !== 'Deleted').length;
  const activeJobsCount = jobs.filter(j => j.status === 'Open').length;
  const closedJobsCount = jobs.filter(j => j.status === 'Closed').length;

  // 2. Candidate & Status metrics
  const totalApplicantsCount = applications.length;
  const shortlistedCount = applications.filter(app => app.status === 'Shortlisted').length;
  const rejectedCount = applications.filter(app => app.status === 'Rejected').length;
  const hiredCount = applications.filter(app => app.status === 'Hired').length;
  
  // Pipeline stages
  const appliedCount = applications.filter(app => app.status === 'Applied').length;
  const underReviewCount = applications.filter(app => app.status === 'Under Review').length;
  const interviewingCount = applications.filter(app => app.status === 'Interview Scheduled').length;

  // 3. Top Performing Job (highest applications count)
  const jobAppCounts = {};
  applications.forEach(app => {
    const job = app.jobId;
    if (job) {
      const jobId = job._id;
      if (!jobAppCounts[jobId]) {
        jobAppCounts[jobId] = { title: job.title, count: 0 };
      }
      jobAppCounts[jobId].count++;
    }
  });

  let topJobTitle = 'N/A';
  let topJobCount = 0;
  Object.values(jobAppCounts).forEach(item => {
    if (item.count > topJobCount) {
      topJobTitle = item.title;
      topJobCount = item.count;
    }
  });

  // Funnel data array for Recharts
  const funnelData = [
    { name: 'Applied', value: appliedCount, color: '#00D4FF' },
    { name: 'Under Review', value: underReviewCount, color: '#8B5CF6' },
    { name: 'Shortlisted', value: shortlistedCount, color: '#3B82F6' },
    { name: 'Interview Scheduled', value: interviewingCount, color: '#F59E0B' },
    { name: 'Hired', value: hiredCount, color: '#22C55E' }
  ];

  // Success rate helper
  const processedCount = shortlistedCount + rejectedCount + hiredCount;
  const successRate = processedCount > 0 ? Math.round((hiredCount / (hiredCount + rejectedCount || 1)) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '35px', paddingBottom: '60px' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
          Recruitment <span className="gradient-text-accent">Analytics</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Analyze hiring pipelines, track conversion funnel metrics, and monitor job post performance.
        </p>
      </div>

      {/* Stats Cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px'
      }}>
        {/* Total Jobs */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Total Jobs
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-color)' }}>
            {totalJobsCount}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {activeJobsCount} Active &bull; {closedJobsCount} Closed
          </span>
        </div>

        {/* Total Applicants */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Total Applicants
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-color)' }}>
            {totalApplicantsCount}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Applications submitted across all posts</span>
        </div>

        {/* Pipeline Success counts */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Shortlisted & Hired
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--success-color)' }}>
            {shortlistedCount} / {hiredCount}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {shortlistedCount} Shortlisted &bull; {hiredCount} Hired candidates
          </span>
        </div>

        {/* Rejected candidates */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            Rejected Candidates
          </span>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--danger-color)' }}>
            {rejectedCount}
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Hiring funnel decision updates</span>
        </div>
      </div>

      {/* Top Performing Job & Success Rate Banner */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '25px' }} className="analytics-banner-grid">
        
        {/* Top Performing Job */}
        <div className="glass-card" style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(139, 92, 246, 0.03) 100%)',
          border: '1.5px solid rgba(0, 212, 255, 0.25)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(0, 212, 255, 0.1)',
            color: 'var(--primary-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
          </div>
          <div style={{ minWidth: 0 }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Top Performing Job Posting
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {topJobTitle}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--primary-color)', fontWeight: '600' }}>
              {topJobCount} applications received
            </span>
          </div>
        </div>

        {/* Hired Success Rate */}
        <div className="glass-card" style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, rgba(0, 212, 255, 0.03) 100%)',
          border: '1.5px solid rgba(34, 197, 94, 0.25)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'rgba(34, 197, 94, 0.1)',
            color: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Decision Offer Acceptance Rate
            </span>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0', color: '#22C55E' }}>
              {successRate}%
            </h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Based on finalized hiring updates
            </span>
          </div>
        </div>

      </div>

      {/* Visual Funnel Chart section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '30px' }} className="analytics-charts-grid">
        
        {/* Recharts Funnel bar representation */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Hiring Conversion Funnel</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: '-10px 0 10px 0' }}>
            Breakdown of candidate progress across the ATS pipelines.
          </p>

          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={funnelData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" horizontal={false} />
                <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="var(--text-color)" fontSize={12} tickLine={false} width={130} />
                <Tooltip 
                  contentStyle={{
                    background: 'var(--sidebar-bg)',
                    border: '1.5px solid var(--card-border)',
                    borderRadius: '8px',
                    color: 'var(--text-color)'
                  }}
                />
                <Bar dataKey="value" barSize={26} radius={[0, 6, 6, 0]}>
                  {funnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList dataKey="value" position="right" style={{ fill: 'var(--text-color)', fontSize: '12px', fontWeight: '700' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Funnel distribution chart stats */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>
            Pipeline Distribution
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
            {funnelData.map((stage) => {
              const pct = totalApplicantsCount > 0 ? Math.round((stage.value / totalApplicantsCount) * 100) : 0;
              return (
                <div key={stage.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: stage.color, display: 'inline-block' }} />
                      <span style={{ fontWeight: '600' }}>{stage.name}</span>
                    </div>
                    <span style={{ fontWeight: '700' }}>
                      {stage.value} <span style={{ color: 'var(--text-muted)', fontSize: '11px', fontWeight: '500' }}>({pct}%)</span>
                    </span>
                  </div>
                  {/* Progress bar background wrapper */}
                  <div style={{
                    width: '100%',
                    height: '6px',
                    borderRadius: '3px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1.5px solid var(--card-border)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${pct}%`,
                      height: '100%',
                      background: stage.color,
                      borderRadius: '3px',
                      transition: 'width 0.8s ease'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .analytics-charts-grid, .analytics-banner-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
