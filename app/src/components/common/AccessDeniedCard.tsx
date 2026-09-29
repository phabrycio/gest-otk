import React from 'react';
import { Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { logSystemAction } from '../../services/auditLogStore';

interface AccessDeniedCardProps {
  requiredRoleLabel: string;
  currentRoleLabel?: string;
  currentUserName?: string;
  onGoBack: () => void;
  sectionName: string;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  requiredRoleLabel,
  currentRoleLabel = 'Colaborador',
  currentUserName = 'Usuário',
  onGoBack,
  sectionName,
}) => {
  // Registra automaticamente no log de auditoria a tentativa de acesso restrito
  React.useEffect(() => {
    try {
      logSystemAction({
        userId: 'security-guard',
        userName: currentUserName,
        userRole: currentRoleLabel,
        module: 'SEGURANCA',
        action: 'TENTATIVA_ACESSO_NAO_AUTORIZADO',
        severity: 'AVISO',
        details: `Tentativa de acesso ao módulo confidencial "${sectionName}" bloqueada pelo Kernel RBAC.`,
      });
    } catch { /* ignore */ }
  }, [currentUserName, currentRoleLabel, sectionName]);

  return (
    <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-3xl border border-rose-200/80 shadow-2xl text-center space-y-4 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 mx-auto flex items-center justify-center shadow-inner">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-100 text-rose-800">
          <ShieldAlert className="w-3.5 h-3.5" />
          Acesso Restrito • Governança LGPD & RBAC
        </span>
        <h2 className="text-xl font-black text-slate-900 pt-2">
          Área Confidencial de {sectionName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto pt-1 leading-relaxed">
          Seu perfil atual (<strong>{currentRoleLabel}</strong>) não possui credencial para visualizar dados financeiros sigilosos, DRE ou margens brutas.
        </p>
      </div>

      <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60 text-xs text-slate-500 font-medium">
        🔒 Apenas colaboradores com perfil <strong>{requiredRoleLabel}</strong> podem desbloquear este setor.
      </div>

      <div className="pt-2">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Minha Operação</span>
        </button>
      </div>
    </div>
  );
};
