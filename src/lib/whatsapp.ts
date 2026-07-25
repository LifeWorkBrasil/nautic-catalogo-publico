import { formatPreco } from './format'
import type { ProdutoPublico } from '../types'

export function montarMensagem(selecionados: ProdutoPublico[]): string {
  const linhas = selecionados.map((p) => `• ${p.nome} — ${formatPreco(p.preco_base)}`)
  return `Olá! Tenho interesse nos seguintes itens do catálogo:\n\n${linhas.join('\n')}`
}

export function linkWhatsapp(telefone: string, mensagem: string): string {
  const digitos = telefone.replace(/\D/g, '')
  const comDdi = digitos.startsWith('55') ? digitos : `55${digitos}`
  return `https://wa.me/${comDdi}?text=${encodeURIComponent(mensagem)}`
}
