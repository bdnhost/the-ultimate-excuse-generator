import { Situation, Style, ExcuseResponse } from '../types';

// API endpoint - uses PHP proxy in production to protect API key
const API_ENDPOINT = './api/generate.php';

export const generateExcuse = async (
  situation: string,
  style: Style,
  customContext?: string
): Promise<ExcuseResponse> => {
  let prompt = `אתה עוזר יצירתי לתלמידים בכיתות ד' עד ו' (גילאי 9-12). צור תירוץ מצחיק או חמוד עבור תלמיד בסיטואציה: "${situation}".`;

  if (situation === Situation.OTHER && customContext) {
    prompt = `אתה עוזר יצירתי לתלמידים בכיתות ד' עד ו'. צור תירוץ עבור הסיטואציה: "${customContext}".`;
  }

  prompt += ` סגנון התירוץ צריך להיות: "${style}".`;
  prompt += `
  הנחיות חשובות:
  1. השפה צריכה להיות מתאימה לילדים (לא שפה גבוהה מדי, אבל לא סלנג גס).
  2. התירוץ צריך להיות יצירתי, אולי לערב חיות מחמד, אחים קטנים, חייזרים או דברים מצחיקים שקורים בבית.
  3. שמור על רוח טובה והומור.
  4. תגובת המורה צריכה להיות משעשעת או סלחנית.
  5. התירוץ צריך להיות בעברית.
  `;

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data as ExcuseResponse;
  } catch (error) {
    console.error("Error generating excuse:", error);
    throw error;
  }
};
