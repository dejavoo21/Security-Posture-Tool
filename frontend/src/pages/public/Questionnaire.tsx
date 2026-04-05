import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/shared/Layout';
import { apiService } from '../../services/api';

export function Questionnaire() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await apiService.getQuestions();
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions.');
      } finally {
        setIsLoading(false);
      }
    }
    loadQuestions();
  }, []);

  const handleSelect = (scoreValue: number) => {
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({ ...prev, [currentQ.id]: scoreValue }));
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Submit
      setIsSubmitting(true);
      try {
        const payload = Object.entries(answers).map(([questionId, scoreValue]) => ({
          questionId,
          scoreValue
        }));
        await apiService.submitAssessment(id!, payload);
        navigate(`/results/${id}`);
      } catch (err) {
        setError('Failed to submit assessment.');
        setIsSubmitting(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="loading-state">Loading questions...</div>
      </Layout>
    );
  }

  if (error || questions.length === 0) {
    return (
      <Layout>
        <div className="error-state">{error || 'No questions available.'}</div>
      </Layout>
    );
  }

  const currentQ = questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / questions.length) * 100);
  const hasAnsweredCurrent = answers[currentQ.id] !== undefined;

  return (
    <Layout>
      <section className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div className="progress-shell">
          <div className="progress-meta">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{progressPercent}% completed</span>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        <div className="question-card">
          <p className="eyebrow">{currentQ.domain}</p>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '32px' }}>{currentQ.text}</h2>

          <div className="option-grid">
            {currentQ.options?.map((opt: any) => {
              const isSelected = answers[currentQ.id] === opt.scoreValue;
              return (
                <button
                  key={opt.text}
                  className={`option-button ${isSelected ? 'option-button--selected' : ''}`}
                  onClick={() => handleSelect(opt.scoreValue)}
                >
                  <span className="option-label">{opt.text}</span>
                </button>
              );
            })}
          </div>

          <div className="inline-actions" style={{ justifyContent: 'space-between', marginTop: '48px' }}>
            <button
              className="button-ghost"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isSubmitting}
            >
              Previous
            </button>
            <button
              className="button-primary"
              onClick={handleNext}
              disabled={!hasAnsweredCurrent || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : currentIndex === questions.length - 1 ? 'Finish Assessment' : 'Next Question'}
            </button>
          </div>
        </div>

      </section>
    </Layout>
  );
}
