import React, { useState, useEffect } from 'react';
import { Situation, Style, ExcuseResponse, HistoryItem } from './types';
import { generateExcuse } from './services/gemini';
import Gauge from './components/Gauge';
import HistoryList from './components/HistoryList';
import AboutModal from './components/AboutModal';

const App: React.FC = () => {
  const [situation, setSituation] = useState<Situation>(Situation.LATE);
  const [customSituation, setCustomSituation] = useState('');
  const [style, setStyle] = useState<Style>(Style.FUNNY);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExcuseResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    // Load history from local storage on mount
    const saved = localStorage.getItem('excuseHistory_kids');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleGenerate = async () => {
    if (situation === Situation.OTHER && !customSituation.trim()) {
      setError("ספרו לנו מה קרה כדי שנוכל לעזור...");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateExcuse(situation, style, customSituation);
      setResult(data);

      const newItem: HistoryItem = {
        ...data,
        id: Date.now().toString(),
        timestamp: Date.now(),
        situation: situation === Situation.OTHER ? customSituation : situation
      };

      const newHistory = [newItem, ...history].slice(0, 10); // Keep last 10
      setHistory(newHistory);
      localStorage.setItem('excuseHistory_kids', JSON.stringify(newHistory));

    } catch (err) {
      setError("אופס, הרובוט התבלבל... נסו שוב!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.text);
      alert("הועתק בהצלחה!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 font-sans max-w-2xl mx-auto">
      
      <AboutModal isOpen={showAbout} onClose={() => setShowAbout(false)} />

      {/* Header */}
      <header className="w-full relative mb-6 text-center mt-4 bg-white p-6 rounded-3xl shadow-comic border-2 border-dashed border-primary rotate-1 transform hover:rotate-0 transition-transform duration-300">
        
        {/* Help Button */}
        <button 
          onClick={() => setShowAbout(true)}
          className="absolute top-3 left-3 bg-blue-100 text-blue-500 hover:bg-blue-200 p-2 rounded-full transition-colors"
          title="מה זה?"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <div className="inline-block p-3 bg-accent rounded-full mb-2 animate-bounce shadow-sm border-2 border-black/10">
           <span className="text-4xl" role="img" aria-label="magic-wand">🪄</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-primary drop-shadow-sm font-round tracking-tight">
          מכונת התירוצים
        </h1>
        <p className="text-secondary font-bold mt-1 text-lg">לכיתות ד', ה' ו-ו' בלבד! 🤫</p>
      </header>

      {/* Main Card */}
      <main className="w-full bg-surface rounded-[2rem] p-6 md:p-8 shadow-comic border-4 border-secondary/30 relative z-10">
        
        {/* Controls */}
        <div className="space-y-6">
          
          {/* Situation Selector */}
          <div className="bg-blue-50 p-4 rounded-2xl border-2 border-blue-100">
            <label className="block text-lg font-bold text-slate-700 mb-2">🤔 מה קרה בבית ספר?</label>
            <select 
              value={situation} 
              onChange={(e) => setSituation(e.target.value as Situation)}
              className="w-full bg-white border-2 border-blue-200 text-slate-700 rounded-xl p-3 focus:ring-4 focus:ring-blue-100 focus:outline-none focus:border-primary text-lg font-medium cursor-pointer shadow-sm"
            >
              {Object.values(Situation).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Custom Situation Input */}
          {situation === Situation.OTHER && (
            <div className="animate-fade-in-down bg-orange-50 p-4 rounded-2xl border-2 border-orange-100">
              <label className="block text-sm font-bold text-orange-600 mb-2">ספרו לנו בקצרה:</label>
              <input
                type="text"
                value={customSituation}
                onChange={(e) => setCustomSituation(e.target.value)}
                placeholder="למשל: הכלב אכל לי את הנעל..."
                className="w-full bg-white border-2 border-orange-200 text-slate-700 rounded-xl p-3 focus:ring-4 focus:ring-orange-100 focus:outline-none"
              />
            </div>
          )}

          {/* Style Selector */}
          <div>
            <label className="block text-lg font-bold text-slate-700 mb-3">🎨 איזה סוג תירוץ בא לך?</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.values(Style).map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-3 rounded-xl text-sm md:text-base transition-all duration-200 border-b-4 font-bold ${
                    style === s 
                    ? 'bg-primary text-white border-red-700 translate-y-1 shadow-inner' 
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-xl shadow-comic transform transition-all active:scale-95 active:shadow-none active:translate-y-1 active:translate-x-1 border-2 border-black/10 ${
              loading 
              ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
              : 'bg-accent hover:bg-yellow-300 text-slate-800'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-bounce">🎲</span>
                מפעיל גלגלי מוח...
              </span>
            ) : 'צור לי תירוץ מנצח! 🚀'}
          </button>
          
          {error && <p className="text-primary font-bold text-center mt-2 bg-red-50 p-2 rounded-lg">{error}</p>}
        </div>
      </main>

      {/* Result Section */}
      {result && (
        <div className="w-full mt-8 animate-fade-in-up">
          <div className="bg-white rounded-3xl p-1 shadow-comic border-4 border-primary relative overflow-hidden">
            
            {/* Background Pattern for Card */}
            <div className="absolute inset-0 bg-primary opacity-5" style={{backgroundImage: 'radial-gradient(#ff6b6b 1px, transparent 1px)', backgroundSize: '10px 10px'}}></div>

            <div className="relative z-10 p-6">
              <div className="flex justify-between items-center mb-6 border-b-2 border-dashed border-slate-200 pb-4">
                 <div className="text-6xl filter drop-shadow-md animate-pulse">{result.emoji}</div>
                 <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">סיכויי הצלחה</span>
                    <Gauge value={result.successRate} />
                 </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-200 mb-6 relative">
                <span className="absolute -top-3 -right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">התירוץ:</span>
                <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed text-center font-round">
                  "{result.text}"
                </p>
              </div>

              <div className="space-y-4">
                 <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl border border-green-200">
                    <span className="text-2xl">👩‍🏫</span>
                    <div>
                      <span className="block text-xs font-bold text-green-600">מה המורה תגיד?</span>
                      <span className="text-slate-700 font-medium">{result.teacherReaction}</span>
                    </div>
                 </div>

                 <button
                   onClick={copyToClipboard}
                   className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors flex items-center justify-center gap-2 shadow-lg"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                   </svg>
                   העתק ותשמור בסוד!
                 </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <HistoryList
        history={history}
        onSelect={(item) => {
          setResult(item);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="w-full mt-8 mb-4 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-slate-200">
          <p className="text-slate-500 text-sm">
            פותח באהבה על ידי{' '}
            <a
              href="https://bdnhost.net"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-secondary transition-colors"
            >
              BDNHOST
            </a>
            {' '}🚀
          </p>
          <p className="text-slate-400 text-xs mt-1">
            פתרונות אירוח ופיתוח אתרים
          </p>
        </div>
      </footer>

    </div>
  );
};

export default App;