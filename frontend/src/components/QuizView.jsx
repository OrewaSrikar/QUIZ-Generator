import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Button } from './Button';
import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const QuizView = ({ quiz }) => {
    // State to track user's selected answer for each question
    const [userAnswers, setUserAnswers] = useState({});
    const [showAllAnswers, setShowAllAnswers] = useState(false);

    if (!quiz) return null;

    const handleOptionSelect = (questionId, optionText) => {
        // Prevent changing answer if already answered or if showing all answers
        if (userAnswers[questionId] || showAllAnswers) return;

        setUserAnswers(prev => ({
            ...prev,
            [questionId]: optionText
        }));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">{quiz.title}</h2>
                <p className="text-slate-600 mb-4">{quiz.summary}</p>
                <div className="flex flex-wrap gap-2 text-sm text-slate-500">
                    <span className="font-semibold">Source:</span>
                    <a href={quiz.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                        {quiz.url}
                    </a>
                </div>
            </div>

            {/* Topics & Sections (Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Key Topics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {quiz.related_topics && quiz.related_topics.map((topic, i) => (
                                <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                    {topic.topic_name}
                                </span>
                            ))}
                            {(!quiz.related_topics || quiz.related_topics.length === 0) && <p className="text-slate-400 italic">No topics found</p>}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Entities</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {quiz.key_entities && Object.entries(quiz.key_entities).map(([key, values]) => (
                            <div key={key} className="mb-2 last:mb-0">
                                <span className="text-xs font-bold uppercase text-slate-400 tracking-wider block mb-1">{key}</span>
                                <div className="flex flex-wrap gap-1">
                                    {Array.isArray(values) && values.map((val, k) => (
                                        <span key={k} className="text-sm text-slate-700 bg-slate-100 px-2 py-0.5 rounded">{val}</span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Quiz Questions */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Quiz Questions</h3>
                    <Button variant="outline" onClick={() => setShowAllAnswers(!showAllAnswers)}>
                        {showAllAnswers ? "Hide Answers" : "Reveal All Answers"}
                    </Button>
                </div>

                {quiz.questions && quiz.questions.map((q, idx) => {
                    const questionId = q.id || idx;
                    const userAnswer = userAnswers[questionId];
                    const isAnswered = userAnswer !== undefined;
                    // If showAllAnswers is true, we treat it as answered
                    const showFeedback = isAnswered || showAllAnswers;

                    return (
                        <Card key={questionId} className="overflow-visible">
                            <CardHeader className="bg-slate-50/50">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex gap-3">
                                        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                            {idx + 1}
                                        </span>
                                        <div>
                                            <h4 className="font-semibold text-slate-900 text-lg leading-tight">{q.question_text}</h4>
                                            <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {q.difficulty ? q.difficulty.toUpperCase() : 'UNKNOWN'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {q.options && q.options.map((opt, oIdx) => {
                                        const isCorrect = opt.option_text === q.answer;
                                        const isSelected = userAnswer === opt.option_text;

                                        let optionClass = "bg-white border-slate-200 hover:border-blue-300 cursor-pointer";

                                        if (showFeedback) {
                                            if (isCorrect) {
                                                optionClass = "bg-green-50 border-green-500 text-green-800";
                                            } else if (isSelected) {
                                                optionClass = "bg-red-50 border-red-500 text-red-800";
                                            } else {
                                                optionClass = "bg-slate-50 border-slate-200 opacity-50";
                                            }
                                        }

                                        return (
                                            <div
                                                key={oIdx}
                                                onClick={() => handleOptionSelect(questionId, opt.option_text)}
                                                className={`flex items-center p-3 rounded-lg border transition-all ${optionClass}`}
                                            >
                                                <span className={`w-6 font-medium mr-3 ${showFeedback && isCorrect ? "text-green-600" : "text-slate-400"}`}>
                                                    {opt.label || String.fromCharCode(65 + oIdx)}
                                                </span>
                                                <span className="flex-1 font-medium">
                                                    {opt.option_text}
                                                </span>
                                                {showFeedback && isCorrect && <CheckCircle className="w-5 h-5 text-green-600" />}
                                                {showFeedback && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
                                            </div>
                                        )
                                    })}
                                </div>

                                {showFeedback && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-blue-800 flex gap-3"
                                    >
                                        <HelpCircle className="w-5 h-5 flex-shrink-0 text-blue-600" />
                                        <div>
                                            <span className="font-bold block mb-1">Explanation:</span>
                                            {q.explanation}
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
