import React from 'react';

const FeaturesSection = () => {
  const featureList = [
    
    {
      icon: "📝",
      title: "Automated Assignment Grading",
      description: "Save time with accurate and efficient AI-powered grading of student assignments.",
    },
    {
      icon: "📊",
      title: "Performance Insights",
      description: "Detailed analytics to track student progress and identify areas for improvement.",
    },
    
   
    {
      icon: "🔒",
      title: "Data Privacy",
      description: "Secure and compliant AI ensuring all student and teacher data stays protected.",
    },
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Features of Our AI Teaching Assistant</h2>
      <div style={styles.grid}>
        {featureList.map((feature, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.icon}>{feature.icon}</div>
            <h3 style={styles.title}>{feature.title}</h3>
            <p style={styles.description}>{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#f9f9f9',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  cardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
  },
  icon: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#007bff',
  },
  title: {
    fontSize: '1.5rem',
    margin: '10px 0',
    color: '#333',
  },
  description: {
    fontSize: '1rem',
    color: '#666',
  },
};

export default FeaturesSection;
