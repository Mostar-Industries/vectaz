
/**
 * Utility functions for audio processing
 */

/**
 * Converts a Blob to a base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      resolve(base64String.split(',')[1]); // Remove the data URL prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Nigerian language expressions to enhance the voice personality
 */
export const nigerianExpressions = {
  greetings: [
    "How far!",
    "Wetin dey!",
    "Abeg!",
    "Oya now!",
    "I hail o!"
  ],
  affirmations: [
    "No wahala!",
    "E go better!",
    "Na so!",
    "I tell you!",
    "Walahi!",
    "Na confirm!"
  ],
  exclamations: [
    "Chai!",
    "Ah ah!",
    "See this thing o!",
    "Na wa o!",
    "Hmm!",
    "Omo!"
  ],
  endings: [
    "No forget o!",
    "As I talk am!",
    "Na so e be!",
    "Make we dey go!",
    "Na the correct one!"
  ]
};

/**
 * Add Nigerian expressions to text based on context
 */
export const enhanceWithNigerianExpressions = (text: string, probability: number = 0.3): string => {
  if (Math.random() > probability) return text;
  
  const sentences = text.split('.');
  if (sentences.length <= 1) return text;
  
  // Determine where to add the expression (beginning, middle, or end)
  const position = Math.floor(Math.random() * 3);
  
  // Pick an appropriate expression based on position in text
  let expression = "";
  if (position === 0) {
    // Beginning - use a greeting
    expression = nigerianExpressions.greetings[Math.floor(Math.random() * nigerianExpressions.greetings.length)];
    return `${expression} ${text}`;
  } else if (position === 1 && sentences.length > 2) {
    // Middle - use an exclamation
    expression = nigerianExpressions.exclamations[Math.floor(Math.random() * nigerianExpressions.exclamations.length)];
    const middleIndex = Math.floor(sentences.length / 2);
    sentences.splice(middleIndex, 0, ` ${expression}`);
    return sentences.join('.');
  } else {
    // End - use an ending phrase
    expression = nigerianExpressions.endings[Math.floor(Math.random() * nigerianExpressions.endings.length)];
    return `${text} ${expression}`;
  }
};

/**
 * Converts a base64 string to a Blob
 */
export const base64ToBlob = (base64: string, mimeType: string): Blob => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  
  for (let i = 0; i < byteCharacters.length; i += 512) {
    const slice = byteCharacters.slice(i, i + 512);
    
    const byteNumbers = new Array(slice.length);
    for (let j = 0; j < slice.length; j++) {
      byteNumbers[j] = slice.charCodeAt(j);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: mimeType });
};

/**
 * Records audio from the user's microphone
 */
export const recordAudio = (): Promise<{ start: () => void, stop: () => Promise<Blob> }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener('dataavailable', (event) => {
        audioChunks.push(event.data);
      });
      
      const start = () => {
        mediaRecorder.start();
      };
      
      const stop = () => {
        return new Promise<Blob>((resolveBlob) => {
          mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            resolveBlob(audioBlob);
            
            // Stop all tracks in the stream when done
            stream.getTracks().forEach(track => track.stop());
          });
          
          mediaRecorder.stop();
        });
      };
      
      resolve({ start, stop });
    } catch (error) {
      reject(error);
    }
  });
};
