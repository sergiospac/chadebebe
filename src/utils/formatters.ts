/**
 * Formata uma data para exibição no formato brasileiro
 * @param date Data a ser formatada
 * @returns Data formatada no padrão dd/mm/yyyy HH:MM
 */
export const formatarData = (date: Date): string => {
  const dia = date.getDate().toString().padStart(2, '0');
  const mes = (date.getMonth() + 1).toString().padStart(2, '0');
  const ano = date.getFullYear();
  const horas = date.getHours().toString().padStart(2, '0');
  const minutos = date.getMinutes().toString().padStart(2, '0');
  
  return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
};

/**
 * Formata um valor monetário
 * @param valor Valor numérico
 * @returns Valor formatado como moeda brasileira
 */
export const formatarMoeda = (valor: number): string => {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

/**
 * Formata o nome do status de uma doação
 * @param status Código numérico do status
 * @returns Nome formatado do status
 */
export const formatarStatusDoacao = (status: number): string => {
  switch (status) {
    case 0:
      return 'Pendente';
    case 1:
      return 'Confirmada';
    case 2:
      return 'Entregue';
    case 3:
      return 'Cancelada';
    default:
      return 'Desconhecido';
  }
};

/**
 * Formata um número de telefone
 * @param telefone Número de telefone
 * @returns Telefone formatado
 */
export const formatarTelefone = (telefone: string): string => {
  // Remove caracteres não numéricos
  const numeros = telefone.replace(/\D/g, '');
  
  if (numeros.length === 11) {
    // Formato (99) 99999-9999
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 7)}-${numeros.slice(7)}`;
  } else if (numeros.length === 10) {
    // Formato (99) 9999-9999
    return `(${numeros.slice(0, 2)}) ${numeros.slice(2, 6)}-${numeros.slice(6)}`;
  }
  
  // Retorna o original se não conseguir formatar
  return telefone;
}; 