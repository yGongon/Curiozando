import React, { useEffect } from 'react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => {
  useEffect(() => {
    document.title = `${title} - Curiozando`;
  }, [title]);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-display font-bold text-secondary mb-4">{title}</h1>
      <p className="text-lg text-text-muted">Esta página está em construção. Volte em breve!</p>
    </div>
  );
};

export default PlaceholderPage;