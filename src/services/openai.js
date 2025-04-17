import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // WARNING: Keep this ONLY for development. Use a backend proxy in production.
});

// Transcribe audio to text
export const transcribeAudio = async (audioBlob) => {
  console.log("OpenAI Service: Starting transcription...");
  try {
    // Convert blob to file
    const file = new File([audioBlob], 'audio.webm', { type: 'audio/webm' });

    console.log("OpenAI Service: Calling OpenAI audio.transcriptions.create");
    const response = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    console.log("OpenAI Service: Transcription successful.");
    return response.text;
  } catch (error) {
    console.error("OpenAI Service: Error during transcription:", error);
    // Improve error message clarity
    if (error.response) {
      // Log details if it's an API error response
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
      throw new Error(`OpenAI Transcription API Error: ${error.response.status} - ${error.response.data?.error?.message || error.message}`);
    } else {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }
};

// Generate structured meeting minutes
export const generateMinutes = async (transcription, meetingTitle = "Meeting") => {
  console.log(`OpenAI Service: Starting minutes generation for title: "${meetingTitle}"`);
  if (!transcription || transcription.trim() === '') {
    console.error("OpenAI Service: Cannot generate minutes with empty transcription.");
    throw new Error("Transcription is empty, cannot generate minutes.");
  }

  try {
    const prompt = `
      You are an AI assistant that creates structured meeting minutes from transcriptions.

      Please convert the following meeting transcription into well-organized minutes with these sections if the information is present in the transcription:

      1.  **Meeting Title**: Use the provided title: "${meetingTitle}"
      2.  **Date and Time**: (If mentioned or inferrable)
      3.  **Participants**: (List names mentioned)
      4.  **Agenda Items**: (Extract main topics discussed)
      5.  **Key Discussion Points**: (Summarize the main points for each topic)
      6.  **Decisions Made**: (List any clear decisions)
      7.  **Action Items**: (Format as: "- [Assignee Name, if mentioned] Task description [Due: Deadline, if mentioned]")
      8.  **Next Steps**: (Any general next steps mentioned)

      Transcription:
      ---
      ${transcription}
      ---

      Format the output STRICTLY as a JSON object with keys: "title", "date", "participants", "agenda", "keyPoints", "decisions", "actionItems", "nextSteps".
      If a section has no relevant information, use an empty string "" or an empty array [] for actionItems.
      Ensure the entire output is valid JSON.
    `;

    console.log("OpenAI Service: Calling OpenAI chat.completions.create");
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo", // Or try "gpt-3.5-turbo" for potentially faster/cheaper results if sufficient
      messages: [
        {
          role: "system",
          content: "You are an expert meeting assistant. Output ONLY valid JSON based on the user's request."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.4, // Slightly increased creativity might help structure
      max_tokens: 3500, // Adjust based on expected output size
      response_format: { type: "json_object" } // Request JSON output format explicitly if using compatible models
    });

    console.log("OpenAI Service: Received response from chat completions API.");
    const minutesText = response.choices[0]?.message?.content;

    if (!minutesText) {
      console.error("OpenAI Service: Received empty content from OpenAI.");
      throw new Error("Received empty response from OpenAI for minutes generation.");
    }

    console.log("OpenAI Service: Raw minutes response content:", minutesText);

    // Parse the JSON response
    try {
      const parsedMinutes = JSON.parse(minutesText);
      console.log("OpenAI Service: Successfully parsed minutes JSON.");
      // Ensure transcription is added back for context if needed later (though it's already saved separately)
      // parsedMinutes.transcription = transcription; // Optional: add transcription to the minutes object itself
      return parsedMinutes;
    } catch (parseError) {
      console.error("OpenAI Service: Failed to parse JSON response from OpenAI:", parseError);
      console.error("OpenAI Service: Received text that failed parsing:", minutesText);
      // Return a structure indicating failure but preserving the raw response
      return {
        error: "Failed to parse AI response into structured minutes.",
        rawResponse: minutesText,
        title: meetingTitle // Keep the title
      };
    }
  } catch (error) {
    console.error("OpenAI Service: Error generating minutes:", error);
     // Improve error message clarity
    if (error.response) {
      console.error('OpenAI API Error Status:', error.response.status);
      console.error('OpenAI API Error Data:', error.response.data);
       throw new Error(`OpenAI Minutes Generation API Error: ${error.response.status} - ${error.response.data?.error?.message || error.message}`);
    } else {
      throw new Error(`Minutes generation failed: ${error.message}`);
    }
  }
};