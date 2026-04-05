import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/shared/Layout';
import { apiService } from '../../services/api';

export function StartAssessment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: '',
    contactName: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Basic Validation
    if (!formData.name || !formData.industry || !formData.email) {
      setError("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.startAssessment(formData);
      if (response && response.id) {
        navigate(`/assessment/${response.id}`);
      } else {
        setError('Failed to start assessment. Please try again.');
      }
    } catch (err) {
      setError('A network error occurred connecting to the backend.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Layout>
      <section className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="surface-card">
          <p className="eyebrow">Onboarding</p>
          <h2 className="page-title">Start your Assessment</h2>
          <p className="muted-text" style={{ marginBottom: 32 }}>
            Provide your company profile below to tailor the baseline recommendations.
          </p>

          {error && (
            <div className="error-state" style={{ marginBottom: 24, padding: 16 }}>
              <p className="error-text" style={{ margin: 0 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-field form-span-2">
              <label htmlFor="name">Company Name *</label>
              <input
                id="name" name="name" type="text"
                placeholder="e.g. Acme Corp"
                value={formData.name} onChange={handleChange}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="industry">Industry *</label>
              <select id="industry" name="industry" value={formData.industry} onChange={handleChange} required>
                <option value="">Select industry</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Finance">Finance</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="size">Company Size</label>
              <select id="size" name="size" value={formData.size} onChange={handleChange}>
                <option value="">Select size</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-1000">201-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="contactName">Contact Name</label>
              <input
                id="contactName" name="contactName" type="text"
                placeholder="John Doe"
                value={formData.contactName} onChange={handleChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email" name="email" type="email"
                placeholder="john@example.com"
                value={formData.email} onChange={handleChange}
                required
              />
            </div>

            <div className="form-span-2" style={{ marginTop: 16 }}>
              <button
                type="submit"
                className="button-primary"
                style={{ width: '100%' }}
                disabled={isLoading}
              >
                {isLoading ? 'Starting...' : 'Begin Questionnaire'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
}
