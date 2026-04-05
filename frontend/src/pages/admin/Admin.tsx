import { useState, useEffect } from 'react';
import { Layout } from '../../components/shared/Layout';
import { apiService } from '../../services/api';

export function Admin() {
    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState<string | null>(null);

    useEffect(() => {
        loadQuestions();
    }, []);

    const loadQuestions = async () => {
        try {
            const data = await apiService.getAdminQuestions();
            setQuestions(data);
        } catch (err) {
            setError('Failed to load questions.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this question?")) return;
        try {
            await apiService.deleteQuestion(id);
            setQuestions(questions.filter(q => q.id !== id));
        } catch (err) {
            alert("Failed to delete.");
        }
    };

    // Group questions by domain
    const domains = Array.from(new Set(questions.map(q => q.domain)));

    return (
        <Layout>
            <section className="page-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
                    <div>
                        <p className="eyebrow" style={{ color: '#93c5fd' }}>Management Console</p>
                        <h2 className="page-title">Assessment Content</h2>
                    </div>
                    <button className="button-primary">Add New Question</button>
                </div>

                {isLoading ? (
                    <div className="loading-state">Loading management data...</div>
                ) : error ? (
                    <div className="error-state">{error}</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                        {domains.map(domain => (
                            <div key={domain} className="surface-card">
                                <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16, marginBottom: 16 }}>
                                    {domain}
                                </h3>

                                <div style={{ display: 'grid', gap: 16 }}>
                                    {questions.filter(q => q.domain === domain).map(q => (
                                        <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', padding: 16, background: 'rgba(255,255,255,0.02)', borderRadius: 12 }}>
                                            <div>
                                                <p style={{ margin: '0 0 8px 0', fontWeight: 600, color: '#fff' }}>{q.text}</p>
                                                <div style={{ display: 'flex', gap: 8 }}>
                                                    <span className="badge">Weight: {q.weight}</span>
                                                    {q.mappings?.map((m: any) => (
                                                        <span key={m.frameworkId} className="badge" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#a78bfa', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
                                                            {m.frameworkId}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                                <button className="button-ghost" style={{ padding: '8px 16px' }}>Edit</button>
                                                <button className="button-ghost" style={{ padding: '8px 16px', color: '#f87171' }} onClick={() => handleDelete(q.id)}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </Layout>
    );
}
