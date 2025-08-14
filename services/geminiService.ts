import { GoogleGenAI, Type } from "@google/genai";
import { GEMINI_MODEL } from '../constants';
import { OptimizedSegment } from "../types";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        segment: {
          type: Type.STRING,
          description: "Fragment zoptymalizowanego tekstu promptu."
        },
        isChanged: {
          type: Type.BOOLEAN,
          description: "Prawda, jeśli ten segment został znacząco zmieniony lub dodany."
        },
        reason: {
          type: Type.STRING,
          description: "Jeśli isChanged jest prawdą, zwięzłe wyjaśnienie, dlaczego zmiana została wprowadzona. Jeśli fałsz, powinien to być pusty ciąg znaków, chyba że jest to informacja o braku konieczności zmian."
        }
      },
      required: ["segment", "isChanged", "reason"],
    }
};

const systemInstruction = `Jesteś światowej klasy ekspertem w inżynierii promptów dla Dużych Modeli Językowych (LLM). Twoim zadaniem jest **bezpośrednie przeredagowanie promptu** dostarczonego przez użytkownika, aby zmaksymalizować jego skuteczność. **Nie udzielaj użytkownikowi ogólnych rad ani wskazówek.** Zamiast tego, **zastosuj najlepsze praktyki samodzielnie**, modyfikując prompt.

Twoja odpowiedź MUSI być tablicą obiektów JSON, ściśle przestrzegając dostarczonego schematu.

1.  **Analiza i przepisanie:** Przeanalizuj język i intencję promptu. **Przepisz go**, dodając szczegóły, kontekst, określając format wyjściowy lub rolę dla AI.
2.  **Segmentacja:** Podziel **NOWY, PRZEREDAGOWANY** prompt na logiczne segmenty, aby zmiany były czytelne.
3.  **Wyjaśnienie zmian (Reason):**
    *   Dla każdego segmentu, który został **zmieniony lub dodany**, ustaw \`isChanged\` na \`true\`. W polu \`reason\` **wyjaśnij krótko i konkretnie, jaką modyfikację wprowadziłeś i jaki jest jej cel.** Przykłady dobrych wyjaśnień: "Dodano format listy dla czytelności", "Sprecyzowano grupę docelową", "Określono rolę dla AI jako eksperta". Przykłady złych wyjaśnień: "Powinieneś dodać formatowanie", "Dobrze jest sprecyzować odbiorcę". **Opisuj swoje działanie, nie pouczaj użytkownika.**
    *   Dla segmentów, które pozostały **niezmienione**, ustaw \`isChanged\` na \`false\` i \`reason\` na pusty ciąg znaków.
4.  **Prompt optymalny:** Jeśli uznasz, że oryginalny prompt jest już doskonały i nie wymaga zmian, zwróć tablicę z jednym obiektem: \`isChanged: false\`, \`segment\` z oryginalnym tekstem i \`reason\` wyjaśniającym, dlaczego jest on już skuteczny (np. "Prompt jest już jasny, specyficzny i kompletny.").
5.  **Język:** Całość odpowiedzi (segmenty i wyjaśnienia) musi być w tym samym języku co prompt wejściowy.
`;


export async function optimizePrompt(prompt: string): Promise<OptimizedSegment[]> {
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      }
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("Otrzymano pustą odpowiedź z API.");
    }
    
    // Sometimes the API might wrap the JSON in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');

    const parsedResult = JSON.parse(cleanedJsonText);

    if (!Array.isArray(parsedResult)) {
        throw new Error("Odpowiedź API nie jest prawidłową tablicą.");
    }

    return parsedResult as OptimizedSegment[];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Błąd API Gemini: ${error.message}`);
    }
    throw new Error("Wystąpił nieznany błąd podczas komunikacji z API Gemini.");
  }
}