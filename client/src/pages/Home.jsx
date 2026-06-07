import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getJobs } from '../services/api';
import JobCard from '../components/JobCard';

// Animated counter component for numeric listings
const Counter = ({ target, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target.replace(/[^0-9]/g, ''), 10);
    if (isNaN(end) || end === 0) return;

    const duration = 2000;
    const stepTime = 30;
    const totalSteps = Math.ceil(duration / stepTime);
    const increment = end / totalSteps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [target]);

  // format count back with comma separation
  const formatNum = (num) => {
    return num.toLocaleString() + suffix;
  };

  return <span>{formatNum(count)}</span>;
};

export const Home = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch active jobs from DB and fall back to mock listings if DB is empty
  useEffect(() => {
    const fetchFeaturedJobs = async () => {
      try {
        const data = await getJobs();
        // filter for active jobs only
        const openJobs = data.filter(j => j.status === 'Open').slice(0, 6);
        setFeaturedJobs(openJobs);
      } catch (err) {
        console.error('Error fetching landing featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedJobs();
  }, []);

  // Mock backup jobs to ensure landing page looks fully populated even on fresh database instances
  const mockJobs = [
    {
      _id: 'mock1',
      title: 'Senior Frontend Engineer',
      company: 'Linear',
      location: 'San Francisco, CA / Remote',
      salary: 175000,
      jobType: 'Full-Time',
      skills: ['React', 'TypeScript', 'Tailwind', 'GraphQL']
    },
    {
      _id: 'mock2',
      title: 'Staff Product Designer',
      company: 'Notion',
      location: 'New York, NY / Remote',
      salary: 185000,
      jobType: 'Full-Time',
      skills: ['Figma', 'Prototyping', 'Design Systems']
    },
    {
      _id: 'mock3',
      title: 'Backend Systems Engineer',
      company: 'Stripe',
      location: 'San Francisco, CA / Remote',
      salary: 195000,
      jobType: 'Full-Time',
      skills: ['Ruby', 'Go', 'REST APIs', 'PostgreSQL']
    },
    {
      _id: 'mock4',
      title: 'Solutions Architect',
      company: 'Vercel',
      location: 'London, UK / Remote',
      salary: 160000,
      jobType: 'Full-Time',
      skills: ['Next.js', 'Vercel Serverless', 'Node.js', 'AWS']
    },
    {
      _id: 'mock5',
      title: 'Product Marketing Manager',
      company: 'Wellfound',
      location: 'Los Angeles, CA',
      salary: 130000,
      jobType: 'Contract',
      skills: ['Growth Marketing', 'SEO', 'Product Strategy']
    },
    {
      _id: 'mock6',
      title: 'Mobile Engineer (React Native)',
      company: 'LinkedIn',
      location: 'Sunnyvale, CA / Remote',
      salary: 165000,
      jobType: 'Full-Time',
      skills: ['React Native', 'iOS', 'Android', 'Redux']
    }
  ];

  const jobsToDisplay = featuredJobs.length > 0 ? featuredJobs : mockJobs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '100px', paddingBottom: '60px' }}>
      
      {/* 1. Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '100px 20px 60px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}>
        {/* Glow vector backdrops */}
        <div style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '500px',
          background: 'rgba(0, 212, 255, 0.06)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          zIndex: -1,
          pointerEvents: 'none',
        }} />
        
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '60%',
          transform: 'translate(-50%, -50%)',
          width: '400px',
          height: '400px',
          background: 'rgba(139, 92, 246, 0.05)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          zIndex: -1,
          pointerEvents: 'none',
        }} />

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--card-border)',
          padding: '8px 18px',
          borderRadius: '30px',
          fontSize: '11px',
          fontWeight: '600',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--primary-color)',
          marginBottom: '24px',
          backdropFilter: 'var(--backdrop-blur)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary-color)', display: 'inline-block', boxShadow: '0 0 8px var(--primary-color)' }}></span>
          Introducing HireNova 2.0
        </div>
        
        <h1 className="hero-title" style={{
          fontSize: 'clamp(38px, 6.5vw, 60px)',
          lineHeight: '1.05',
          marginBottom: '24px',
          fontFamily: 'var(--font-display)',
          fontWeight: '800',
          letterSpacing: '-0.03em',
          maxWidth: '900px'
        }}>
          Find Your <span className="gradient-text-accent">Dream Job</span> Faster
        </h1>
        
        <p className="hero-description" style={{
          fontSize: 'clamp(14px, 2vw, 18px)',
          color: 'var(--text-muted)',
          maxWidth: '680px',
          lineHeight: '1.6',
          marginBottom: '40px',
        }}>
          Connect with top companies and discover opportunities tailored for your career. Experience a beautiful, lightning-fast workspace designed for modern talent acquisition.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/jobs">
            <button className="btn-primary hero-btn" style={{ padding: '16px 32px', fontSize: '14px' }}>
              Browse Jobs
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </button>
          </Link>
          <Link to="/signup">
            <button className="btn-secondary hero-btn" style={{ padding: '16px 32px', fontSize: '14px' }}>
              Get Started
            </button>
          </Link>
        </div>
      </section>

      {/* 2. Numerical Stats Section */}
      <section style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '24px',
        padding: '0 20px'
      }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '35px 20px', borderRadius: 'var(--border-radius-md)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-color)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
            <Counter target="10K" suffix="+" />
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Active Jobs</span>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '35px 20px', borderRadius: 'var(--border-radius-md)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
            <Counter target="5K" suffix="+" />
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Top Companies</span>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '35px 20px', borderRadius: 'var(--border-radius-md)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--primary-color)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
            <Counter target="50K" suffix="+" />
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Applications</span>
        </div>
        <div className="glass-card" style={{ textAlign: 'center', padding: '35px 20px', borderRadius: 'var(--border-radius-md)' }}>
          <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-color)', fontFamily: 'var(--font-display)', marginBottom: '6px' }}>
            <Counter target="500" suffix="+" />
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Recruiters</span>
        </div>
      </section>

      {/* 3. Features Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
            Engineered for <span className="gradient-text-accent">Modern Recruitment</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '550px', margin: '0 auto' }}>
            Simplify your matching workflow with tools built for speed and precision.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          maxWidth: '1100px',
          margin: '0 auto',
          width: '100%'
        }}>
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderRadius: 'var(--border-radius-md)' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(0, 212, 255, 0.1)',
              border: '1px solid rgba(0, 212, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-color)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Precision Filtering</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Instantly drill down to relevant roles using keyword search, location queries, and role sorting parameters.
            </p>
          </div>
          
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderRadius: 'var(--border-radius-md)' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-color)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>One-Click Application</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Upload resumes, write custom cover letters, and track application milestones through a beautiful workspace portal.
            </p>
          </div>

          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '15px', borderRadius: 'var(--border-radius-md)' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--success-color)'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            </div>
            <h3 style={{ fontSize: '19px', fontWeight: '700', fontFamily: 'var(--font-display)' }}>Recruiter Intelligence</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Check pipelines, update candidate statuses, archive postings, and review hiring success metrics with SVG charts.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Featured Jobs Section */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '40px', padding: '0 20px' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', marginBottom: '10px' }}>
            Featured <span className="gradient-text-accent">Opportunities</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '550px', margin: '0 auto' }}>
            Explore open roles at high-growth tech companies and startup teams.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '0.1em' }}>LOADING FEATURED OPPORTUNITIES...</span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%'
          }}>
            {jobsToDisplay.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Call to Action Banner */}
      <section style={{ padding: '0 20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
        <div className="glass-card" style={{
          padding: '60px 40px',
          borderRadius: 'var(--border-radius-lg)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(139, 92, 246, 0.15)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
        }}>
          {/* Subtle glow behind card */}
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '250px',
            height: '250px',
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: -1,
            pointerEvents: 'none'
          }} />

          <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontFamily: 'var(--font-display)', marginBottom: '16px', fontWeight: '800' }}>
            Ready to Find Your <span className="gradient-text-accent">Next Breakthrough?</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 30px auto', lineHeight: '1.6' }}>
            Whether you are a recruiter scaling a high-growth team or a developer seeking your next challenge, HireNova is the platform built for your career speed.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup">
              <button className="btn-primary" style={{ padding: '14px 28px' }}>
                Join as Candidate
              </button>
            </Link>
            <Link to="/signup">
              <button className="btn-secondary" style={{ padding: '14px 28px', background: 'rgba(139, 92, 246, 0.08)', borderColor: 'rgba(139, 92, 246, 0.2)' }} onMouseOver={e => e.target.style.borderColor = 'var(--accent-color)'} onMouseOut={e => e.target.style.borderColor = 'rgba(139, 92, 246, 0.2)'}>
                Join as Recruiter
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
