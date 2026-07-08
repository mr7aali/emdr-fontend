"use client";
import React, { createContext, useContext, useState } from 'react';

const AssessmentContext = createContext();

export const AssessmentProvider = ({ children }) => {
    const [phq9Answers, setPhq9Answers] = useState({});
    const [gad7Answers, setGad7Answers] = useState({});
    const [desAnswers, setDesAnswers] = useState({});
    const [assessmentResults, setAssessmentResults] = useState(null);

    const value = {
        phq9Answers, setPhq9Answers,
        gad7Answers, setGad7Answers,
        desAnswers, setDesAnswers,
        assessmentResults, setAssessmentResults,
    };

    return (
        <AssessmentContext.Provider value={value}>
            {children}
        </AssessmentContext.Provider>
    );
};

export const useAssessment = () => useContext(AssessmentContext);
