/**
 * securitySanitizer.ts
 * 
 * Camada de Sanitização & Defesa de Injeção (XSS, PII & LGPD)
 * Tk Gestão e Tecnologia • Restaurante Engenho Manauara
 */

/**
 * Remove tags HTML e scripts maliciosos de strings fornecidas por usuários
 */
export function sanitizePlainText(input: string, maxLength: number = 200): string {
  if (!input) return '';
  return input
    .replace(/<[^>]*>?/gm, '') // Remove tags HTML (<script>, <img>, etc.)
    .replace(/[<>'"]/g, '')    // Remove dangerous angle brackets and quotes
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitiza números de telefone e WhatsApp, removendo caracteres proibidos
 */
export function sanitizePhoneNumber(phone: string): string {
  if (!phone) return '';
  // Mantém apenas dígitos, parênteses, espaço e hífen
  const cleaned = phone.replace(/[^\d\s()+-]/g, '').trim();
  return cleaned.slice(0, 20);
}

/**
 * Mascara número de telefone para proteção de dados (LGPD) em visores públicos
 * Ex: "(92) 98112-3456" -> "(92) 9****-3456"
 */
export function maskPhoneLgpd(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 8) return '****-****';
  const last4 = digits.slice(-4);
  const ddd = digits.length >= 10 ? `(${digits.slice(0, 2)}) ` : '';
  return `${ddd}9****-${last4}`;
}

/**
 * Higieniza o objeto de conta de usuário para armazenamento seguro em sessão de cliente,
 * impedindo a persistência de senhas e PINs em texto plano no localStorage.
 */
export function sanitizeUserForSession<T extends { password?: string; pin?: string }>(user: T): T {
  return {
    ...user,
    password: '[SESSAO_PROTEGIDA]',
    pin: '[SESSAO_PROTEGIDA]',
  };
}
