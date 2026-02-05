import React, { useState } from 'react';
import { Card, CardContent } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { QuizView } from '../components/QuizView';
import api from '../services/api';
import { Sparkles, BrainCircuit } from 'lucide-react';

export const Generator = () => {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizData, setQuizData] = useState(null);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError(null);
        setQuizData(null);

        try {
            const response = await api.post('/generate', { url });
            setQuizData(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.detail || "Failed to generate quiz. Please check the URL or try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Search Section */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 pb-2">
                    AI Quiz Generator
                </h1>
                <p className="text-lg text-slate-600">
                    Transform any Wikipedia article into an interactive quiz in seconds.
                </p>
            </div>

            <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                    <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Paste Wikipedia URL here (e.g., https://en.wikipedia.org/wiki/Alan_Turing)"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="h-12 text-lg"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            isLoading={loading}
                            className="h-12 px-8 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700"
                        >
                            {!loading && <Sparkles className="w-5 h-5 mr-2" />}
                            Generate Quiz
                        </Button>
                    </form>
                    {error && (
                        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-20 animate-pulse">
                    <BrainCircuit className="w-16 h-16 mx-auto text-indigo-400 mb-4 animate-bounce" />
                    <h3 className="text-xl font-medium text-slate-700">Analyzing Article Content...</h3>
                    <p className="text-slate-500">Our AI is reading the page and crafting questions.</p>
                </div>
            )}

            {/* Result View */}
            {quizData && <QuizView quiz={quizData} />}
        </div>
    );
};
