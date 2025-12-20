
const OPENAI_API_KEY_STORAGE_KEY = "openai_api_key";

export function getOpenAiApiKey(): string | null {
  return typeof window !== "undefined"
    ? localStorage.getItem(OPENAI_API_KEY_STORAGE_KEY)
    : null;
}

export function setOpenAiApiKey(key: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(OPENAI_API_KEY_STORAGE_KEY, key);
  }
}

// Function for clearing key (optional)
export function clearOpenAiApiKey() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(OPENAI_API_KEY_STORAGE_KEY);
  }
}

export const useChatbotApi = () => {
  const simulateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const key = getOpenAiApiKey();
      if (!key) throw new Error("No OpenAI API key set.");

      const API_URL = "https://api.openai.com/v1/chat/completions";
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const reply =
        data?.choices?.[0]?.message?.content ??
        typeof data === "string"
          ? data
          : JSON.stringify(data);

      return reply;
    } catch (error: any) {
      console.error("Error calling OpenAI API:", error);
      if (error.message?.includes("No OpenAI API key")) {
        return "Please provide your OpenAI API key.";
      }
      return (
        "Sorry, I'm experiencing technical issues reaching the response server. Please try again in a moment."
      );
    }
  };

  return { simulateBotResponse };
};
