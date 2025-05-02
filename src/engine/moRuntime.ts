// src/engine/moRuntime.ts
import { useVoice } from '@/hooks/useVoice';
import { MoScript, MoScriptResult } from './types';
import { getTemplate } from './voiceTemplates';

const generateWithGROQ = async (result: MoScriptResult, style: string): Promise<string> => {
  try {
    const response = await fetch('https://api.groq.com/v1/voice', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        decision_result: result,
        style,
        template: getTemplate('ranking', style as any)
      })
    });

    if (!response.ok) throw new Error('GROQ API error');
    return (await response.json()).voice_line;
  } catch (error) {
    console.warn('GROQ failed, using local template');
    return getTemplate('ranking', style as any)
      .replace('{name}', result.topAlternative.name)
      .replace('{score}', result.topAlternative.score.toFixed(1));
  }
};

export const generateVoiceLine = async (result: MoScriptResult, style = 'calm'): Promise<string> => {
  // Try GROQ first, fallback to local
  return generateWithGROQ(result, style).catch(() => 
    getTemplate('ranking', style as any)
      .replace('{name}', result.topAlternative.name)
      .replace('{score}', result.topAlternative.score.toFixed(1))
  );
};

export const runMoScript = async (script: MoScript, inputs: Record<string, any>) => {
  const { speak } = useVoice();
  const result = script.logic(inputs);

  try {
    if (script.voiceLine) {
      // Try GROQ first, fallback to local voiceLine
      const line = script.voiceLine?.(result) || await generateVoiceLine(result);
      
      // Force Nigerian English with high energy
      speak(line, 'en-NG', 1.2, 1.3);
    }
  } catch (error) {
    console.error('Voice narration failed:', error);
  }

  return result;
};
