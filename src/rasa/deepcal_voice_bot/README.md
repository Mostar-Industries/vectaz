
# DeepCAL Voice Bot System

This is the full offline-ready setup for running DeepCAL as a voice-capable AI system.

## Structure

- `engine/` – your Python decision logic (AHP-TOPSIS)
- `rasa/` – DeepCAL intents, NLU, actions, domain, config
- `voice_clips/` – Folder to drop .mp3 or .wav audio (e.g., `ranking.mp3`, `greet.mp3`)
- `voice_responder.py` – API to serve voice from `voice_clips/`

## Running the Voice Server

```bash
cd deepcal_voice_bot
uvicorn voice_responder:app --reload
# Access with: http://localhost:8000/say?message=greet
```

## Next Steps

1. Clone your voice (e.g., via ElevenLabs or Coqui)
2. Generate .mp3s from `voice_library.yml`
3. Drop them into `voice_clips/`
4. Serve via `/say?message=...`
