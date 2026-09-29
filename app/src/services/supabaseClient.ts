// ============================================================
// CLIENTE & SERVIÇO SUPABASE (CLOUD DATABASE POSTGRESQL)
// Tk Gestão e Tecnologia • Unidade Engenho Manauara
// Configurado para Vercel + Supabase
// ============================================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_SUPABASE_URL = 'tk_supabase_url';
const STORAGE_KEY_SUPABASE_ANON = 'tk_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  const storedUrl = localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '';
  const storedKey = localStorage.getItem(STORAGE_KEY_SUPABASE_ANON) || '';

  const url = storedUrl || envUrl;
  const anonKey = storedKey || envKey;

  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey && url.startsWith('http')),
  };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_SUPABASE_ANON, anonKey.trim());
  } catch (e) {
    console.error('Erro ao salvar credenciais do Supabase:', e);
  }
}

let cachedClient: SupabaseClient | null = null;
let lastClientKey = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  const currentKey = `${config.url}_${config.anonKey}`;
  if (cachedClient && lastClientKey === currentKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    lastClientKey = currentKey;
    return cachedClient;
  } catch (e) {
    console.error('Erro ao inicializar cliente Supabase:', e);
    return null;
  }
}

export interface ConnectionTestResult {
  connected: boolean;
  status: 'ONLINE' | 'NOT_CONFIGURED' | 'ERROR';
  message: string;
  latencyMs?: number;
  tablesFound?: string[];
}

/**
 * Testa a conexão com o banco de dados Supabase na nuvem.
 */
export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const config = getSupabaseConfig();
  if (!config.isConfigured) {
    return {
      connected: false,
      status: 'NOT_CONFIGURED',
      message: 'Supabase ainda não configurado. Adicione a URL do projeto e a chave anônima (anon key).',
    };
  }

  const client = getSupabaseClient();
  if (!client) {
    return {
      connected: false,
      status: 'ERROR',
      message: 'Falha ao instanciar o cliente Supabase com os parâmetros fornecidos.',
    };
  }

  const start = performance.now();
  try {
    // Tenta uma consulta simples à tabela de restaurantes ou à API REST do Supabase
    const { data, error } = await client.from('restaurants').select('id, name').limit(1);

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // Se a tabela ainda não foi criada, mas a API respondeu, o endpoint e as credenciais são válidos!
      if (error.code === '42P01' || error.message.includes('relation "restaurants" does not exist')) {
        return {
          connected: true,
          status: 'ONLINE',
          latencyMs,
          message: `Conectado ao Supabase com sucesso (${latencyMs}ms)! Execute o script schema.sql no SQL Editor para criar as tabelas.`,
        };
      }
      return {
        connected: false,
        status: 'ERROR',
        latencyMs,
        message: `Erro retornado pelo Supabase: ${error.message} (${error.code || 'API_ERR'})`,
      };
    }

    return {
      connected: true,
      status: 'ONLINE',
      latencyMs,
      message: `Conectado ao PostgreSQL no Supabase com sucesso! (${latencyMs}ms de latência)`,
      tablesFound: ['restaurants'],
    };
  } catch (err: any) {
    return {
      connected: false,
      status: 'ERROR',
      message: `Erro de rede ou conexão com o Supabase: ${err?.message || 'Servidor inacessível'}`,
    };
  }
}
