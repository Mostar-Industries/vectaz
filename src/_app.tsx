import { AppProps } from 'next/app';
import { VoiceSettingsProvider } from '@/context/VoiceSettingsContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <VoiceSettingsProvider>
      <Component {...pageProps} />
    </VoiceSettingsProvider>
  );
}
