import { useState, useRef } from 'react';
import { POI } from '../types';

interface UseVoiceNavigationProps {
  routeInfo: { instructions: any[] } | null;
  routingTo: POI | null;
  currentInstructionIndex: number;
}

export function useVoiceNavigation({
  routeInfo,
  routingTo,
  currentInstructionIndex
}: UseVoiceNavigationProps) {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const speakInstruction = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("[Speech Event] SpeechSynthesis API not supported in this browser.");
      return;
    }
    if (!isVoiceEnabled || isMuted) {
      console.log("[Speech Event] Speech skipped: voice engine disabled or muted.");
      return;
    }
    
    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const allVoices = window.speechSynthesis.getVoices();
    const enVoice = allVoices.find(v => v.lang.startsWith('en')) || allVoices[0];
    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onstart = () => console.log("[Speech Event] Speech started:", text);
    utterance.onend = () => console.log("[Speech Event] Speech ended:", text);
    utterance.onerror = (e) => console.error("[Speech Event] Speech error:", e.error, e);
    
    window.speechSynthesis.speak(utterance);
  };

  const replayCurrentInstruction = () => {
    if (!routeInfo || !routeInfo.instructions || routeInfo.instructions.length === 0 || !routingTo) return;
    const idx = Math.max(0, currentInstructionIndex - 1);
    const step = routeInfo.instructions[idx];
    if (step) {
      const textToSpeak = idx === 0 ? `Starting route to ${routingTo.name}. ${step.text}` : step.text;
      console.log("[Speech Event] Replaying instruction index:", idx, "Text:", textToSpeak);
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.onstart = () => console.log("[Speech Event] Started speaking replay:", textToSpeak);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleToggleVoice = () => {
    const nextVal = !isVoiceEnabled;
    setIsVoiceEnabled(nextVal);
    if (nextVal) {
      setTimeout(() => {
        speakInstruction("Voice navigation is now active.");
      }, 50);
    }
  };

  return {
    isVoiceEnabled,
    setIsVoiceEnabled,
    isMuted,
    setIsMuted,
    speakInstruction,
    replayCurrentInstruction,
    handleToggleVoice,
  };
}
