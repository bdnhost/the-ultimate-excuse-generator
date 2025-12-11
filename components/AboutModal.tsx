import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border-4 border-secondary relative animate-bounce-in">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 bg-red-100 text-red-500 hover:bg-red-200 rounded-full p-2 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-yellow-100 rounded-full mb-3 text-4xl">
            🕵️‍♂️
          </div>
          <h2 className="text-3xl font-black text-slate-700 font-round">מה זה הדבר הזה?</h2>
        </div>

        <div className="space-y-4 text-slate-600 text-lg leading-relaxed text-right">
          <p>
            <span className="font-bold text-primary">היי תלמידים!</span> שכחתם שיעורים? הכלב אכל את המחברת? איחרתם כי הצלתם חתול מעץ?
          </p>
          <p>
            אנחנו כאן כדי לעזור לכם לצאת מזה (אולי) בשלום! המכונה המופלאה שלנו ממציאה את התירוצים הכי יצירתיים, מצחיקים ומוזרים בעולם.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100 text-sm">
            <p className="font-bold text-blue-600 mb-1">💡 טיפ של אלופים:</p>
            <p>המטרה היא לגרום למורה לחייך. אם המורה מחייכת - ניצחתם! אבל... אל תסמכו עלינו ב-100%, כן? 😉</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-8 py-3 bg-primary text-white font-black rounded-xl text-xl shadow-comic hover:translate-y-1 hover:shadow-none transition-all"
        >
          יאללה הבנתי, בוא נמציא!
        </button>
      </div>
    </div>
  );
};

export default AboutModal;