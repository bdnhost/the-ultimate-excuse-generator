import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Situation, Style, ExcuseResponse } from '../types';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const excuseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The generated excuse text in Hebrew.",
    },
    successRate: {
      type: Type.INTEGER,
      description: "Estimated percentage chance (0-100) that this excuse will work.",
    },
    teacherReaction: {
      type: Type.STRING,
      description: "A short, predicted reaction from the teacher in Hebrew.",
    },
    emoji: {
      type: Type.STRING,
      description: "A single emoji representing the excuse vibe.",
    }
  },
  required: ["text", "successRate", "teacherReaction", "emoji"],
};

export const generateExcuse = async (
  situation: string,
  style: Style,
  customContext?: string
): Promise<ExcuseResponse> => {
  const model = "gemini-2.5-flash";

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
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: excuseSchema,
        temperature: 1, // High creativity for kids
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as ExcuseResponse;
    }
    throw new Error("No text returned from model");
  } catch (error) {
    console.error("Error generating excuse:", error);
    throw error;
  }
};