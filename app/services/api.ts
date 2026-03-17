// Get API base URL from environment or default to localhost for development
const API_BASE_URL = import.meta.env.VITE_API_BASE_UR;

console.log('[API Service] Using API_BASE_URL:', API_BASE_URL);

export interface TranscriptionResponse {
  kikuyu_text: string;
  english_text: string;
  timestamp: string;
  success?: boolean;
}

interface RecordingState {
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
  stream: MediaStream | null;
}

class ApiService {
  private recordingState: RecordingState = {
    mediaRecorder: null,
    audioChunks: [],
    stream: null,
  };

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API Service] Request failed:', error);
      throw error;
    }
  }

  async healthCheck() {
    return this.request<{ status: string; service: string; models_ready?: boolean }>(
      '/api/health'
    );
  }

  async startRecording() {
    try {
      // Request permission to use microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recordingState.stream = stream;

      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });
      this.recordingState.mediaRecorder = mediaRecorder;
      this.recordingState.audioChunks = [];

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        this.recordingState.audioChunks.push(event.data);
      };

      // Start recording
      mediaRecorder.start();
      console.log('[API Service] Recording started');

      // Also notify backend
      await this.request('/api/start-recording', {
        method: 'POST',
      });

      return {
        status: 'recording_started',
        message: 'Browser recording started',
      };
    } catch (error) {
      console.error('[API Service] Failed to start recording:', error);
      throw error;
    }
  }

  async stopRecording(): Promise<TranscriptionResponse> {
    return new Promise((resolve, reject) => {
      const mediaRecorder = this.recordingState.mediaRecorder;

      if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        reject(new Error('No active recording'));
        return;
      }

      mediaRecorder.onstop = async () => {
        try {
          // Clean up stream
          if (this.recordingState.stream) {
            this.recordingState.stream.getTracks().forEach((track) => {
              track.stop();
            });
            this.recordingState.stream = null;
          }

          // Create blob from chunks
          const audioBlob = new Blob(this.recordingState.audioChunks, {
            type: 'audio/webm',
          });

          console.log('[API Service] Audio blob created:', audioBlob.size, 'bytes');

          // Send to backend for processing
          const result = await this.transcribeAndTranslate(
            new File([audioBlob], 'audio.webm', { type: 'audio/webm' })
          );

          resolve(result);
        } catch (error) {
          console.error('[API Service] Error processing recording:', error);
          reject(error);
        }
      };

      // Stop recording
      mediaRecorder.stop();
      console.log('[API Service] Recording stopped');
    });
  }

  async transcribeAndTranslate(audioFile: File): Promise<TranscriptionResponse> {
    try {
      const formData = new FormData();
      formData.append('file', audioFile);

      console.log('[API Service] Sending audio to backend:', audioFile.name, audioFile.size);

      const response = await fetch(`${API_BASE_URL}/api/transcribe-and-translate`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Processing Error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('[API Service] Translation complete:', result);
      return result;
    } catch (error) {
      console.error('[API Service] Transcription error:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
