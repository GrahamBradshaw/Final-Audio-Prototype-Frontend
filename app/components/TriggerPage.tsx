import { Link } from "react-router";
import { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useRedirectOnRefreshAlt } from "../hooks/useRedirectOnRefresh";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { apiService } from "../services/api";

export default function TriggerPage() {
  const { theme, toggleTheme } = useTheme();
  useRedirectOnRefreshAlt();
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [kikuyuText, setKikuyuText] = useState("");
  const [englishText, setEnglishText] = useState("");
  const [error, setError] = useState("");
  const [recordingTime, setRecordingTime] = useState(0);

  const startRecording = async () => {
    try {
      setError("");
      setKikuyuText("");
      setEnglishText("");
      setRecordingTime(0);
      
      const result = await apiService.startRecording();
      
      if (result.status === 'recording_started') {
        setIsRecording(true);
      } else {
        setError("Failed to start recording: " + (result as any).error || "Unknown error");
      }
    } catch (err) {
      setError("Failed to connect to backend: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      const result = await apiService.stopRecording();
      
      if (result.kikuyu_text) {
        setKikuyuText(result.kikuyu_text);
        setEnglishText(result.english_text);
      } else if ((result as any).error) {
        setError((result as any).error);
      } else {
        setError("Processing failed: " + JSON.stringify(result));
      }
    } catch (err) {
      setError("Failed to process recording: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.76 2.41-2.26-.05-4.29-.95-5.77-2.41M19 12v2h4v-2z"/>
                <path d="M5 12v2H1v-2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">Voice Bridge</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Kikuyu ↔ English</p>
            </div>
          </Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <svg className="w-5 h-5 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21.64 15.95c-.18-.96-.76-1.88-1.57-2.57-.21.23-.41.48-.62.72.71.87 1.1 1.96 1.09 3.19-.01 1.23-.37 2.35-1.01 3.28-.64.93-1.53 1.61-2.57 1.9-.25.07-.51.11-.77.11-.07 0-.14 0-.21 0-1.16-.07-2.27-.58-3.07-1.4.02.16.04.33.06.49.32 1.88.08 3.9-.7 5.4-.78 1.5-1.96 2.7-3.37 3.47-.42.22-.87.37-1.33.45-.09 0-.19.02-.28.02-1.73 0-3.38-.65-4.64-1.82-.88-.83-1.54-1.92-1.9-3.12-.36-1.19-.42-2.44-.19-3.63.23-1.19.77-2.31 1.54-3.28.77-.97 1.77-1.69 2.87-2.12 1.1-.43 2.27-.52 3.42-.29.82.15 1.59.5 2.28.99 1.67-3.65 5.63-6.19 10.33-6.19 1.07 0 2.1.11 3.1.33-.31-1.8.2-3.62 1.46-5.07.72-.81 1.61-1.44 2.59-1.81 1.13-.43 2.32-.54 3.52-.32 1.2.23 2.34.82 3.22 1.67.88.85 1.5 1.95 1.82 3.16.31 1.21.3 2.47 0 3.68z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5 text-slate-800 dark:text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6m9-2h-3V1h-2v3H9V1H7v3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H4V9h16v11z"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <Card variant="gradient" padding="xl" shadow="lg" className="relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900 to-transparent" />
          </div>
          <CardContent className="flex flex-col items-center justify-center py-16 relative z-10">
            <div className={`mb-6 p-6 rounded-full ${isRecording ? 'pulse-ring' : ''} bg-white/20 backdrop-blur-sm`}>
              <svg className={`w-12 h-12 text-white transition-transform ${isRecording ? 'animate-pulse' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.76 2.41-2.26-.05-4.29-.95-5.77-2.41"/>
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              {isRecording ? 'Listening...' : isProcessing ? 'Processing...' : 'Ready to record'}
            </h2>
            
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-sm text-white/90 font-medium">
                {isRecording ? 'Recording active' : isProcessing ? 'Translating...' : 'Stand by'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Control Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={startRecording}
            disabled={isRecording || isProcessing}
            className="w-full flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Start Recording
          </Button>
          
          <Button
            variant="secondary"
            size="lg"
            onClick={stopRecording}
            disabled={!isRecording || isProcessing}
            className="w-full flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h12v12H6z"/>
            </svg>
            Stop Recording
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card variant="outline" padding="lg" className="border-2 border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/30">
            <CardContent>
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                </div>
                <button onClick={() => setError("")} className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                  </svg>
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {(kikuyuText || englishText) && (
          <div className="space-y-4">
            <div className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
              Translation Results
            </div>
            
            {kikuyuText && (
              <Card variant="elevated" padding="lg" shadow="md" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600" />
                <CardContent className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    🇰🇪 Kikuyu Transcription
                  </h3>
                  <p className="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
                    {kikuyuText}
                  </p>
                </CardContent>
              </Card>
            )}

            {englishText && (
              <Card variant="elevated" padding="lg" shadow="md" className="relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-green-600" />
                <CardContent className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                    🇬🇧 English Translation
                  </h3>
                  <p className="text-lg leading-relaxed font-medium text-slate-700 dark:text-slate-200">
                    {englishText}
                  </p>
                </CardContent>
              </Card>
            )}

            <button
              onClick={() => {
                setKikuyuText("");
                setEnglishText("");
              }}
              className="w-full py-2 px-4 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-sm font-medium"
            >
              Clear Results
            </button>
          </div>
        )}

        {/* Empty State */}
        {!kikuyuText && !englishText && !isRecording && !isProcessing && (
          <div className="text-center py-12">
            <div className="opacity-30 mb-4">
              <svg className="w-16 h-16 mx-auto text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.76 2.41-2.26-.05-4.29-.95-5.77-2.41"/>
              </svg>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Click "Start Recording" to begin translating from Kikuyu to English
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <p>Voice Bridge v1.0 • Preserving Language, Bridging Culture</p>
        </div>
      </footer>
    </div>
  );
}
