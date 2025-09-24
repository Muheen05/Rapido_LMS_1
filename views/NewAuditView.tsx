import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitNewAudit, getAllAgents } from '../services/mockApi';
import { Agent, Audit } from '../types';

const NewAuditView: React.FC = () => {
    const { agent: auditor } = useAuth();
    const navigate = useNavigate();
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selectedAgent, setSelectedAgent] = useState('');
    const [ticketId, setTicketId] = useState('');
    const [score, setScore] = useState(85);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (auditor?.agentEmail !== 'auditor@rapido.com') {
            navigate('/dashboard');
        }
        const fetchAgents = async () => {
            const agentList = await getAllAgents();
            setAgents(agentList);
        };
        fetchAgents();
    }, [auditor, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (!selectedAgent || !ticketId || !feedback) {
            setError('Please fill in all fields.');
            return;
        }

        setSubmitting(true);
        try {
            const auditData: Omit<Audit, 'auditId' | 'timestamp'> = {
                agentEmail: selectedAgent,
                auditorEmail: auditor!.agentEmail,
                ticketId,
                overallScore: score,
                feedback,
            };
            await submitNewAudit(auditData);
            setSuccess(`Audit for ticket ${ticketId} submitted successfully! AI coaching will be generated if the score is below 80.`);
            // Reset form
            setSelectedAgent('');
            setTicketId('');
            setScore(85);
            setFeedback('');
        } catch (err) {
            setError('Failed to submit audit. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };
    
    const formInputStyle = "mt-1 block w-full bg-white border border-slate-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary sm:text-sm";

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 md:p-10 rounded-2xl border border-slate-200">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Submit New Audit</h1>
            <p className="text-slate-500 mb-8">Fill in the details below to complete the agent audit.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="agent" className="block text-sm font-medium text-slate-700">Agent</label>
                        <select id="agent" value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)} required className={formInputStyle}>
                            <option value="">Select an agent</option>
                            {agents.map(a => <option key={a.agentEmail} value={a.agentEmail}>{a.agentName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="ticketId" className="block text-sm font-medium text-slate-700">Ticket ID</label>
                        <input type="text" id="ticketId" value={ticketId} onChange={e => setTicketId(e.target.value)} required className={formInputStyle} />
                    </div>
                </div>
                <div>
                    <label htmlFor="score" className="block text-sm font-medium text-slate-700">Overall Score: <span className="font-bold text-primary text-lg">{score}</span></label>
                    <input type="range" id="score" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} className="mt-2 block w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
                <div>
                    <label htmlFor="feedback" className="block text-sm font-medium text-slate-700">Auditor Feedback</label>
                    <textarea id="feedback" rows={6} value={feedback} onChange={e => setFeedback(e.target.value)} required className={formInputStyle} placeholder="Provide specific, actionable feedback..."></textarea>
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                {success && <p className="text-green-600 text-sm text-center">{success}</p>}
                <div className="pt-4">
                    <button type="submit" disabled={submitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-400 disabled:cursor-not-allowed transition-all">
                        {submitting ? 'Submitting...' : 'Submit Audit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default NewAuditView;