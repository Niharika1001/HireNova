import React, { useState, useEffect } from 'react';

// Counter component that eases from 0 to the target number
const AnimatedCounter = ({ value, duration = 1000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const end = parseInt(value, 10);
    if (isNaN(end) || end === 0) {
      setCount(value);
      return;
    }

    const totalSteps = 40;
    const stepTime = duration / totalSteps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / totalSteps;
      const easeProgress = progress * (2 - progress); // easeOutQuad formula
      const nextCount = Math.floor(easeProgress * end);
      
      if (currentStep >= totalSteps) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(nextCount);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Metric card with neon glow framing and icon backgrounds
export const DashboardCard = ({ title, value, icon, accentColor }) => {
  const colorVar = accentColor === 'secondary' ? 'var(--accent-secondary)' : 'var(--accent-primary)';
  const glowVar = accentColor === 'secondary' ? 'var(--glow-shadow-secondary)' : 'var(--glow-shadow-primary)';

  return (
    <div className="glass-card" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      padding: '24px',
    }}>
      {/* Icon Frame */}
      <div style={{
        background: `rgba(${accentColor === 'secondary' ? '124, 58, 237' : '6, 214, 255'}, 0.1)`,
        border: `1px solid rgba(${accentColor === 'secondary' ? '124, 58, 237' : '6, 214, 255'}, 0.25)`,
        width: '56px',
        height: '56px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colorVar,
        boxShadow: glowVar,
      }}>
        {icon}
      </div>

      {/* Numerical Data details */}
      <div>
        <span className="metric-label" style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'var(--font-display)' }}>
          {title}
        </span>
        <h2 className="metric-value" style={{
          fontSize: '32px',
          fontWeight: '800',
          marginTop: '4px',
          fontFamily: 'var(--font-display)',
          background: `linear-gradient(135deg, var(--text-color) 30%, ${colorVar} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          <AnimatedCounter value={value} />
        </h2>
      </div>
    </div>
  );
};

export default DashboardCard;
