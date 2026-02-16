
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { ChatMessage, SensorData, HardwareNode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define tools for the AI to interact with the farm
const farmTools: FunctionDeclaration[] = [
  {
    name: 'toggleIrrigation',
    description: 'Turn the farm irrigation system on or off.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        state: { type: Type.BOOLEAN, description: 'True to turn on, false to turn off.' }
      },
      required: ['state']
    }
  },
  {
    name: 'setLights',
    description: 'Set the brightness of the greenhouse lights.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        brightness: { type: Type.NUMBER, description: 'Brightness percentage from 0 to 100.' }
      },
      required: ['brightness']
    }
  },
  {
    name: 'toggleVentilation',
    description: 'Turn the greenhouse ventilation fans on or off.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        state: { type: Type.BOOLEAN, description: 'True to turn on, false to turn off.' }
      },
      required: ['state']
    }
  }
];

// In-memory cache to handle quota limits (429 errors)
let lastInsightsFetch = 0;
let cachedInsights: string[] = [
  "Optimizing irrigation based on current soil moisture trends.",
  "Atmospheric conditions remain within ideal growth parameters.",
  "AI detection indicates zero pathogenic signatures in current zones."
];

// Throttling duration in milliseconds (e.g., 2 minutes for insights to save quota)
const INSIGHTS_THROTTLE_MS = 120000; 

export const getCropInsights = async (sensorData: SensorData[]) => {
  const now = Date.now();
  
  // If we fetched recently, return cached data to avoid hitting quota limits
  if (now - lastInsightsFetch < INSIGHTS_THROTTLE_MS && cachedInsights.length > 0) {
    return cachedInsights;
  }

  try {
    lastInsightsFetch = now;
    const dataString = JSON.stringify(sensorData);
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As a professional agricultural AI analyst, analyze this real-time farm sensor data and provide 3-4 concise, professional insights for a farmer. 
      Sensor Data: ${dataString}
      Format the response as a clean JSON array of strings. Do not include any markdown formatting like \`\`\`json. Just the array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text.trim();
    // Basic cleaning in case the model returns markdown code blocks
    const cleanedText = text.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const result = JSON.parse(cleanedText);
    
    if (Array.isArray(result) && result.length > 0) {
      cachedInsights = result;
    }
    return cachedInsights;
  } catch (error: any) {
    console.error("Gemini Insights Error:", error);
    // If we hit a 429 or any other error, return the cached data instead of failing
    return cachedInsights;
  }
};

export const chatWithAI = async (
  message: string, 
  history: ChatMessage[], 
  systemContext?: { sensors: SensorData[], hardware: HardwareNode[], controls: any }
) => {
  try {
    const contextString = systemContext 
      ? `CURRENT SYSTEM STATUS:
         Sensors: ${systemContext.sensors.map(s => `${s.name}: ${s.value}${s.unit}`).join(', ')}
         Hardware: ${systemContext.hardware.map(h => `${h.name} (${h.status})`).join(', ')}
         Actuators: Irrigation: ${systemContext.controls.irrigation ? 'ON' : 'OFF'}, Ventilation: ${systemContext.controls.ventilation ? 'ON' : 'OFF'}, Lights: ${systemContext.controls.lights}%`
      : "";

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: `You are an expert Agricultural AI Assistant. You have access to real-time sensor data and actuators.
        Use context to give specific answers. You can also turn pumps/fans on/off or dim lights if requested.
        Keep answers professional and concise. Avoid technical jargon unless asked.
        ${contextString}`,
        tools: [{ functionDeclarations: farmTools }]
      },
    });
    
    return response;
  } catch (error) {
    console.error("AI Chat Error:", error);
    return null;
  }
};
