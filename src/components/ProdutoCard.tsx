import { Images, Check } from 'lucide-react'
import { formatPreco } from '../lib/format'
import type { ProdutoPublico } from '../types'

export default function ProdutoCard({
  produto,
  selecionado,
  onAbrir,
  onToggleSelecao,
}: {
  produto: ProdutoPublico
  selecionado: boolean
  onAbrir: () => void
  onToggleSelecao: () => void
}) {
  return (
    <article className="overflow-hidden rounded-md border border-foam-200 bg-white">
      <div className="relative">
        <button
          onClick={onAbrir}
          className="flex h-40 w-full items-center justify-center overflow-hidden bg-hull-900/[0.04] text-slate-400 hover:bg-hull-900/[0.07]"
        >
          {produto.foto_principal_url ? (
            <img
              src={produto.foto_principal_url}
              alt={produto.nome}
              className="h-full w-full object-cover"
            />
          ) : (
            <Images className="h-6 w-6" strokeWidth={1.5} />
          )}
        </button>
        {produto.status_estoque === 'esgotado' && (
          <span className="absolute left-2 top-2 rounded-full bg-hull-900/85 px-2.5 py-1 text-[10px] font-medium text-foam-50">
            Esgotado
          </span>
        )}
      </div>
      <div className="p-4">
        <button onClick={onAbrir} className="text-left">
          <p className="font-display text-lg text-hull-900">{produto.nome}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{produto.descricao}</p>
        </button>
        <div className="mt-3 flex items-center justify-between border-t border-foam-200 pt-3">
          <span className="font-mono text-sm text-hull-900">{formatPreco(produto.preco_base)}</span>
          <span className="text-xs text-slate-400">
            {produto.comprimento ? `${produto.comprimento} m` : ''}
          </span>
        </div>
        <button
          onClick={onToggleSelecao}
          className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-medium transition-colors ${
            selecionado
              ? 'border-brass-500 bg-brass-200/30 text-hull-900'
              : 'border-foam-200 text-slate-500 hover:border-wake-400'
          }`}
        >
          {selecionado ? (
            <>
              <Check className="h-3.5 w-3.5" strokeWidth={2} />
              Selecionado
            </>
          ) : (
            'Selecionar'
          )}
        </button>
      </div>
    </article>
  )
}
