import React, { useState, useEffect } from 'react';
import { CoachingTip, Audit } from '../types';

interface CoachingFeedProps {
  coachingTips: CoachingTip[];
  audits: Audit[];
  hasLowScores?: boolean;
}

const CoachingFeed: React.FC<CoachingFeedProps> = ({ coachingTips, audits, hasLowScores }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [coachingTips]);

  const goToPrevious = () => {
    setCurrentIndex(prevIndex => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex < coachingTips.length - 1 ? prevIndex + 1 : prevIndex));
  };

  const formatCoachingText = (text: string) => {
    return text.split('*').filter(item => item.trim() !== "").map((item, index) => (
      <li key={index} className="text-slate-700 flex items-start">
        <span className="text-primary mr-3 mt-1">&#8226;</span>
        <span>{item.trim()}</span>
      </li>
    ));
  };

  const currentTip = coachingTips[currentIndex];
  const relatedAudit = currentTip ? audits.find(a => a.auditId === currentTip.auditId) : null;
  const isError = currentTip?.generatedCoachingTips.startsWith("ERROR:");
  const errorText = isError ? currentTip.generatedCoachingTips.replace("ERROR: ", "") : "";


  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 h-full flex flex-col justify-between">
      {coachingTips.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-4">
          {hasLowScores ? (
             <>
              <div className="bg-red-50 p-4 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <p className="font-semibold text-slate-700">AI Coaching Unavailable</p>
              <p className="text-sm">We detected low scores but could not generate coaching tips. Please check the API configuration.</p>
            </>
          ) : (
            <>
              <div className="bg-green-50 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-semibold text-slate-700">No coaching tips available.</p>
              <p className="text-sm">Great job on keeping your scores up!</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-y-auto pr-2 flex-grow min-h-0">
            <div key={currentIndex} className="animate-fade-in">
              {isError ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm">
                    <h4 className="font-bold text-red-700 mb-2">AI Coaching Error</h4>
                    <p className="text-red-600 text-xs break-words">{errorText}</p>
                    <p className="text-xs text-slate-500 mt-3">
                        For Ticket <span className="font-semibold text-primary">{relatedAudit?.ticketId || 'N/A'}</span>
                    </p>
                </div>
              ) : (
                 <>
                    <p className="text-xs text-slate-500 mb-2">
                        Coaching for Ticket <span className="font-semibold text-primary">{relatedAudit?.ticketId || 'N/A'}</span>
                    </p>
                    <ul className="space-y-2">
                        {formatCoachingText(currentTip.generatedCoachingTips)}
                    </ul>
                 </>
              )}
            </div>
          </div>
          {coachingTips.length > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous coaching tip"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <p className="text-sm font-medium text-slate-500">
                {currentIndex + 1} of {coachingTips.length}
              </p>
              <button
                onClick={goToNext}
                disabled={currentIndex === coachingTips.length - 1}
                className="p-2 rounded-full text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next coaching tip"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CoachingFeed;