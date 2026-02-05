import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { QuizView } from '../components/QuizView';
import { FileText, Calendar, ExternalLink, ChevronRight } from 'lucide-react';

export const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/history');
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDetails = async (quiz) => {
        // Optimistically set data, but maybe we need full details if list is partial?
        // Backend /history returns full objects currently, so we can just use that.
        // If not, we would call /quiz/{id}
        setSelectedQuiz(quiz);
        setIsModalOpen(true);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900">Quiz History</h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium">
                    {history.length} Quizzes Generated
                </span>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {history.map((quiz) => (
                        <Card key={quiz.id} className="hover:border-blue-300 transition-colors group cursor-pointer" onClick={() => handleOpenDetails(quiz)}>
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
                                            {quiz.title}
                                        </h3>
                                        <p className="text-slate-500 text-sm line-clamp-1 mb-2">
                                            {quiz.summary}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <ExternalLink className="w-3 h-3" />
                                                {new URL(quiz.url).hostname}
                                            </span>
                                            {/* Date could be added if DB supported created_at */}
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" className="text-slate-400 group-hover:text-blue-600">
                                    Details <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}

                    {history.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">No quizzes generated yet.</p>
                        </div>
                    )}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Quiz Details"
            >
                {selectedQuiz && <QuizView quiz={selectedQuiz} />}
            </Modal>
        </div>
    );
};
