import { useState, useEffect } from 'react';
import { portfolioService } from '../services/supabase';

export const usePortfolioData = (languageCode = 'en') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const portfolioData = await portfolioService.getPortfolioData(languageCode);
        setData(portfolioData);
      } catch (err) {
        console.error('Error fetching portfolio data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [languageCode]);

  return { data, loading, error };
};

export const useSectionData = (sectionName, languageCode = 'en') => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const sectionData = await portfolioService.getSection(sectionName, languageCode);
        setData(sectionData);
      } catch (err) {
        console.error(`Error fetching ${sectionName} data:`, err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sectionName, languageCode]);

  return { data, loading, error };
}; 