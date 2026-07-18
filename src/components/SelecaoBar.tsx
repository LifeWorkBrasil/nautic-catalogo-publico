import { MessageCircle, X } from 'lucide-react'
import type { ProdutoPublico } from '../types'

export default function SelecaoBar({
  selecionados,
  onRemover,
  onLimpar,
  onEnviar,
}: {
  selecionados: ProdutoPublico[]
  onRemover: (id: string) => void
  onLimpar: () => void
  onEnviar: () => void
}) {
  if (selecionados.length === 0) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-foam-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-3 px-4 py-3 sm:px-8">
        <div className="flex flex-1 flex-wrap gap-2">
          {selecionados.map((p) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 rounded-full bg-foam-100 px-3 py-1 text-xs text-hull-900"
            >
              {p.nome}
              <button onClick={() => onRemover(p.id)} className="text-slate-400 hover:text-signal-red">
                <X className="h-3 w-3" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
        <button onClick={onLimpar} className="shrink-0 text-xs text-slate-400 hover:text-hull-900">
          Limpar
        </button>
        <button
          onClick={onEnviar}
          className="flex shrink-0 items-center gap-2 rounded-md bg-hull-900 px-4 py-2.5 text-sm font-medium text-foam-50 hover:bg-hull-800"
        >
          <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
          Enviar por WhatsApp ({selecionados.length})
        </button>
      </div>
    </div>
  )
}
