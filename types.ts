export interface ExcuseResponse {
  text: string;
  successRate: number; // 0-100
  teacherReaction: string;
  emoji: string;
}

export enum Situation {
  LATE = 'איחרתי לבית הספר',
  HOMEWORK = 'לא הכנתי שיעורים',
  FORGOT_ITEM = 'שכחתי ציוד/מחברת',
  TIRED = 'נרדמתי בכיתה',
  TEST = 'לא למדתי למבחן',
  MESS = 'עשיתי בלאגן',
  OTHER = 'משהו אחר לגמרי...'
}

export enum Style {
  FUNNY = 'קורע מצחוק',
  SAD = 'פרצוף עצוב (פאפי)',
  FANTASY = 'דמיוני וקסום',
  HERO = 'סיפור גבורה',
  MYSTERY = 'מסתורי ומעניין',
  POLITE = 'ילד טוב ירושלים'
}

export interface HistoryItem extends ExcuseResponse {
  id: string;
  timestamp: number;
  situation: string;
}