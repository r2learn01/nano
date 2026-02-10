
import { GoogleGenAI } from "@google/genai";
import { ModelType } from "../types";

export const generateImage = async (prompt: string): Promise<string> => {
  // Create a new GoogleGenAI instance right before making the API call 
  // to ensure it uses the most up-to-date API key from the environment.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: ModelType.PRO,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let imageUrl = '';
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!imageUrl) throw new Error("No image data received from model");
    return imageUrl;
  } catch (error: any) {
    const errorMessage = error.message || "";
    // Handle potential key issues gracefully but gemini-2.5-flash-image 
    // typically relies on the provided environment key.
    throw error;
  }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: ModelType.EDIT,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1],
            mimeType: mimeType
          }
        },
        { text: prompt }
      ]
    }
  });

  let imageUrl = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        break;
      }
    }
  }

  if (!imageUrl) throw new Error("Failed to edit image");
  return imageUrl;
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};
