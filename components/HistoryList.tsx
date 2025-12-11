import React from 'react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect }) => {
  if (history.length === 0) return null;

  return (
    <div className="mt-12 w-full max-w-2xl px-4 pb-8">
      <h3 className="text-xl font-black mb-4 text-slate-700 text-center flex items-center justify-center gap-2">
        <span>📜</span> תירוצים שהשתמשנו בהם
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onSelect(item)}
            className="bg-white p-4 rounded-xl border-2 border-slate-100 hover:border-secondary hover:shadow-md cursor-pointer transition-all flex justify-between items-center group"
          >
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-600 truncate mb-1">{item.situation}</p>
              <p className="text-xs text-slate-400 truncate group-hover:text-secondary">{item.text}</p>
            </div>
            <div className={`text-sm font-black ml-2 px-2 py-1 rounded-lg ${
              item.successRate > 80 ? 'bg-green-100 text-green-600' : 
              item.successRate > 50 ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-500'
            }`}>
              {item.successRate}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;