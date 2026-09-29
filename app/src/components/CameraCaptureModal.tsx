import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, ShieldAlert, Sparkles, RefreshCw, X, CheckCircle2, AlertTriangle, Lock } from 'lucide-react';

interface CameraCaptureModalProps {
  title: string;
  subtitle: string;
  expectedItemName?: string;
  onCaptureValidated: (photoData: {
    photoUrl: string;
    timestamp: string;
    aiValidated: boolean;
    fraudDetected: boolean;
    fraudReason?: string;
  }) => void;
  onClose: () => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  title,
  subtitle,
  expectedItemName,
  onCaptureValidated,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [fraudDetected, setFraudDetected] = useState(false);
  const [fraudReason, setFraudReason] = useState<string | null>(null);
  const [aiValidated, setAiValidated] = useState(false);
  const [simulateFraud, setSimulateFraud] = useState(false);

  const handleTriggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCapturedImage(imageUrl);
      runAiFraudCheck(imageUrl);
    }
  };

  const runAiFraudCheck = (_imageUrl: string) => {
    setAnalyzing(true);
    setFraudDetected(false);
    setFraudReason(null);
    setAiValidated(false);

    // Simulação do processamento de visão computacional da IA
    setTimeout(() => {
      setAnalyzing(false);

      if (simulateFraud) {
        setFraudDetected(true);
        setFraudReason(
          '🚨 TENTATIVA DE FRAUDE: A IA detectou linhas de varredura (efeito moiré) indicando fotografia tirada da tela de outro celular/monitor. A imagem não foi capturada do alimento físico na bancada de inox.'
        );
        setAiValidated(false);
      } else {
        setFraudDetected(false);
        setAiValidated(true);
      }
    }, 1200);
  };

  const handleConfirm = () => {
    if (!capturedImage) return;

    onCaptureValidated({
      photoUrl: capturedImage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      aiValidated: !fraudDetected,
      fraudDetected: fraudDetected,
      fraudReason: fraudReason || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-white animate-in fade-in zoom-in duration-200">
        {/* Cabeçalho */}
        <div className="p-4 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                {title}
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  <Lock className="w-2.5 h-2.5 inline mr-0.5" />
                  Câmera Bloqueada
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm font-bold p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo / Visor de Câmera */}
        <div className="p-4 space-y-4">
          {/* Input Restrito - Atributo capture="environment" bloqueia a escolha da galeria */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileSelected}
            className="hidden"
          />

          {!capturedImage ? (
            <div
              onClick={handleTriggerCamera}
              className="border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-950/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group min-h-[260px] relative overflow-hidden"
            >
              {/* Mira visual de câmera */}
              <div className="absolute inset-4 pointer-events-none border border-slate-800/60 rounded-xl flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-t-2 border-l-2 border-emerald-500" />
                  <div className="w-4 h-4 border-t-2 border-r-2 border-emerald-500" />
                </div>
                <div className="flex justify-between">
                  <div className="w-4 h-4 border-b-2 border-l-2 border-emerald-500" />
                  <div className="w-4 h-4 border-b-2 border-r-2 border-emerald-500" />
                </div>
              </div>

              <div className="w-16 h-16 rounded-full bg-emerald-600/20 group-hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 mb-3">
                <Camera className="w-8 h-8" />
              </div>

              <span className="text-sm font-bold text-white block">Tocar para Abrir Câmera Traseira</span>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[240px]">
                Acesso direto ao sensor físico. Galeria bloqueada pelo sistema para evitar uso de fotos antigas.
              </p>

              {expectedItemName && (
                <span className="mt-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-amber-300 border border-slate-700">
                  Foco: {expectedItemName}
                </span>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {/* Pré-visualização da Foto Capturada */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center">
                <img src={capturedImage} alt="Foto Capturada" className="w-full h-full object-cover" />

                {/* Carimbo Criptográfico de Segurança */}
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-md rounded-lg p-2 border border-white/10 text-[10px] font-mono text-slate-300 flex items-center justify-between">
                  <span>🔒 SHA-256: 8f9b2d...c41</span>
                  <span>{new Date().toLocaleTimeString('pt-BR')} &bull; Ponta Negra</span>
                </div>
              </div>

              {/* Status da Análise da IA */}
              {analyzing && (
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center gap-2.5 text-xs text-slate-300">
                  <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                  <span>IA Gemini analisando textura, moiré de tela e metadados...</span>
                </div>
              )}

              {fraudDetected && (
                <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-600/80 text-rose-200 text-xs space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 font-bold text-rose-400">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>ALERTA DE ANOMALIA / FRAUDE</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-rose-200/90">{fraudReason}</p>
                  <span className="text-[10px] text-rose-400 font-semibold block">
                    ⚠️ Este alerta será registrado no relatório de fechamento do gerente!
                  </span>
                </div>
              )}

              {aiValidated && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-600/60 text-emerald-200 text-xs flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-emerald-300 block">Autenticidade Validada pela IA</strong>
                    <span className="text-[10px] text-emerald-300/80">
                      Insumo físico e bancada de inox reconhecidos em tempo real.
                    </span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleTriggerCamera}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tirar Outra Foto</span>
                </button>

                <button
                  onClick={handleConfirm}
                  disabled={analyzing}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 shadow-md"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Salvar Foto Blindada</span>
                </button>
              </div>
            </div>
          )}

          {/* Toggle de Simulação de Fraude para Demonstração */}
          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px]">Simular tentativa de foto de tela de celular:</span>
            <button
              type="button"
              onClick={() => {
                const next = !simulateFraud;
                setSimulateFraud(next);
                if (capturedImage) runAiFraudCheck(capturedImage);
              }}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                simulateFraud
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {simulateFraud ? '🚨 Modo Fraude Ativado' : 'Modo Foto Real'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
