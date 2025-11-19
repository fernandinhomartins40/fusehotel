/**
 * Number Utils
 *
 * Utilitários para manipulação de números
 */

/**
 * Formata um número como moeda brasileira (BRL)
 */
export function formatCurrencyBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata um número como moeda
 */
export function formatCurrency(value: number, currency: string = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Formata um número com separadores de milhares
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}

/**
 * Formata um número como porcentagem
 */
export function formatPercent(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calcula a porcentagem de um valor em relação a um total
 */
export function calculatePercent(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calcula o desconto em porcentagem
 */
export function calculateDiscountPercent(original: number, discounted: number): number {
  if (original === 0) return 0;
  return ((original - discounted) / original) * 100;
}

/**
 * Aplica desconto em porcentagem
 */
export function applyDiscountPercent(value: number, percent: number): number {
  return value - (value * percent) / 100;
}

/**
 * Arredonda para 2 casas decimais
 */
export function roundToTwo(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Clamp - limita um valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Gera um número aleatório entre min e max
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Verifica se um número está entre um range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}
