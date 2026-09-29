import React, { useState } from 'react';
import { Lock, Unlock, Shield, User, Check, X, Delete } from 'lucide-react';
import { logSystemAction } from '../services/auditLogStore';

export interface OperatorProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  pin: string;
  badgeColor: string;
}

interface QuickPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentOperator: OperatorProfile;
  onOperatorChange: (operator: OperatorProfile) => void;
}

export const KNOWN_OPERATORS: OperatorProfile[] = [
  {
    id: 'user-rogerio',
    name: 'Rogério',
    role: 'Proprietário & Sócio',
    department: 'DIRETORIA EXECUTIVA',
    pin: '1001',
    badgeColor: 'bg-amber-500 text-amber-950 font-bold',
  },
  {
    id: 'user-sidney',
    name: 'Sidney',
    role: 'Proprietário & Sócio',
    department: 'DIRETORIA EXECUTIVA',
    pin: '1002',
    badgeColor: 'bg-amber-500 text-amber-950 font-bold',
  },
  {
    id: 'user-ivan',
    name: 'Ivan',
    role: 'Gerente Geral (Acesso Full)',
    department: 'COMANDO TOTAL DA LOJA',
    pin: '2001',
    badgeColor: 'bg-emerald-700 text-white font-bold',
  },
  {
    id: 'user-pabricio',
    name: 'Pabricio',
    role: 'Gerente em Treinamento (Acesso Full)',
    department: 'COMANDO E GESTÃO DE LOJA',
    pin: '2002',
    badgeColor: 'bg-teal-700 text-white font-bold',
  },
  {
    id: 'user-patricia',
    name: 'Patricia',
    role: 'Supervisora de Loja',
    department: 'SUPERVISÃO DE LOJA',
    pin: '3001',
    badgeColor: 'bg-indigo-600 text-white font-semibold',
  },
  {
    id: 'user-pedro',
    name: 'Pedro',
    role: 'Chefe do Bar',
    department: 'BAR & CHOPP',
    pin: '4001',
    badgeColor: 'bg-purple-600 text-white font-semibold',
  },
  {
    id: 'user-madio',
    name: 'Mádio',
    role: 'Chefe de Cozinha',
    department: 'COZINHA & BRASA',
    pin: '5001',
    badgeColor: 'bg-orange-600 text-white font-semibold',
  },
  {
    id: 'user-esmael',
    name: 'Esmael',
    role: 'Sub Chefe de Cozinha',
    department: 'COZINHA & BRASA',
    pin: '5002',
    badgeColor: 'bg-amber-600 text-white font-semibold',
  },
  {
    id: 'user-anne',
    name: 'Anne',
    role: 'Comissária de Salão',
    department: 'SALÃO & COMISSARIA',
    pin: '6001',
    badgeColor: 'bg-rose-600 text-white font-semibold',
  },
  {
    id: 'user-elendia',
    name: 'Elendia',
    role: 'Comissária de Salão',
    department: 'SALÃO & COMISSARIA',
    pin: '6002',
    badgeColor: 'bg-rose-600 text-white font-semibold',
  },
  {
    id: 'user-amanda',
    name: 'Amanda',
    role: 'Operadora de Caixa',
    department: 'FRENTE DE CAIXA',
    pin: '7001',
    badgeColor: 'bg-blue-600 text-white font-semibold',
  },
  {
    id: 'user-maria-asg',
    name: 'Maria',
    role: 'ASG',
    department: 'LIMPEZA & HIGIENIZAÇÃO',
    pin: '8001',
    badgeColor: 'bg-slate-700 text-white font-bold',
  },
];

export const QuickPinModal: React.FC<QuickPinModalProps> = ({
  isOpen,
  onClose,
  currentOperator,
  onOperatorChange,
}) => {
  const [enteredPin, setEnteredPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedOp, setSelectedOp] = useState<OperatorProfile | null>(null);

  const handleDigit = (digit: string) => {
    if (enteredPin.length < 4) {
      const nextPin = enteredPin + digit;
      setEnteredPin(nextPin);
      setErrorMessage(null);

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setEnteredPin((prev) => prev.slice(0, -1));
    setErrorMessage(null);
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, enteredPin]);

  if (!isOpen) return null;

  const handleClear = () => {
    setEnteredPin('');
    setErrorMessage(null);
  };

  const verifyPin = (pinToTest: string) => {
    const found = KNOWN_OPERATORS.find((op) => op.pin === pinToTest);
    if (found) {
      logSystemAction({
        userId: found.id,
        userName: found.name,
        userRole: found.role,
        module: 'AUTH',
        action: 'Troca Rápida de Operador via PIN',
        details: `Sessão alterada para ${found.name} (${found.role}) via teclado numérico no salão/cozinha.`,
        severity: 'INFO',
        metadata: { previousOperator: currentOperator.name, newOperator: found.name, department: found.department }
      });
      onOperatorChange(found);
      setEnteredPin('');
      onClose();
    } else {
      logSystemAction({
        userId: currentOperator.id,
        userName: currentOperator.name,
        userRole: currentOperator.role,
        module: 'AUTH',
        action: 'PIN Incorreto Digitado',
        details: `Tentativa com PIN inválido registrada durante a sessão de ${currentOperator.name}.`,
        severity: 'AVISO'
      });
      setErrorMessage('PIN incorreto. Tente novamente.');
      setTimeout(() => {
        setEnteredPin('');
        setErrorMessage(null);
      }, 1200);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0f172a] border border-slate-700/80 w-full max-w-md rounded-3xl p-6 shadow-2xl text-white space-y-6 flex flex-col items-center">
        {/* Topo do Teclado */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 mx-auto shadow-md">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white tracking-tight">
            Bloqueio de Sessão & Troca Rápida de PIN
          </h3>
          <p className="text-xs text-slate-400">
            Operador Atual: <span className="text-amber-400 font-bold">{currentOperator.name}</span> ({currentOperator.role})
          </p>
        </div>

        {/* Display de PIN com 4 Bolinhas */}
        <div className="flex items-center gap-4 py-2">
          {[0, 1, 2, 3].map((idx) => {
            const isFilled = enteredPin.length > idx;
            return (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isFilled
                    ? 'bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110'
                    : 'bg-slate-700/60 border border-slate-600'
                }`}
              />
            );
          })}
        </div>

        {errorMessage && (
          <div className="text-xs font-bold text-rose-400 animate-shake">
            {errorMessage}
          </div>
        )}

        {/* Lista Rápida dos Usuários da Casa com Dica de PIN */}
        <div className="w-full bg-slate-800/60 border border-slate-700/60 rounded-2xl p-2.5 grid grid-cols-2 gap-2 text-[11px]">
          {KNOWN_OPERATORS.map((op) => (
            <button
              key={op.id}
              onClick={() => {
                setEnteredPin(op.pin);
                verifyPin(op.pin);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 border border-slate-700 text-left transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-bold text-slate-200 block truncate">{op.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{op.role}</span>
              </div>
              <span className="text-[9px] font-mono text-amber-400/80 mt-1 block">PIN: {op.pin}</span>
            </button>
          ))}
        </div>

        {/* Teclado Numérico Touch Screen */}
        <div className="grid grid-cols-3 gap-2.5 w-full max-w-[280px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleDigit(digit)}
              className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-lg font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
            >
              {digit}
            </button>
          ))}
          <button
            onClick={handleClear}
            className="h-14 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-xs font-bold text-slate-400 active:scale-95 transition-all flex items-center justify-center"
          >
            LIMPAR
          </button>
          <button
            onClick={() => handleDigit('0')}
            className="h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-lg font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-slate-900/60 hover:bg-slate-800 text-slate-300 active:scale-95 transition-all flex items-center justify-center"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Cancelar e Manter Sessão Atual
        </button>
      </div>
    </div>
  );
};
