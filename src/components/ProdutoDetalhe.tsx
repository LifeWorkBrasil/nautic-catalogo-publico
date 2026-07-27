import { useEffect, useState } from 'react'
import { X, Check, BellRing } from 'lucide-react'
import { listFotosProduto, listItensInclusosProduto, criarAvisoReposicao } from '../lib/api'
import { formatPreco } from '../lib/format'
import type {
  ProdutoPublico,
  SubcategoriaProduto,
  CampoPersonalizado,
  FotoProduto,
  ProdutoItemIncluso,
} from '../types'

function formatarValorCampo(campo: CampoPersonalizado, valor: string | number | boolean | null): string | null {
  if (valor === null || valor === undefined || valor === '') return null
  if (campo.tipo === 'booleano') return valor ? 'Sim' : 'Não'
  return String(valor)
}

function AvisoReposicaoForm({ produtoId }: { produtoId: string }) {
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function enviar() {
    if (!nome.trim() || !telefone.trim()) return
    setEnviando(true)
    setErro(null)
    try {
      await criarAvisoReposicao(produtoId, nome.trim(), telefone.trim())
      setEnviado(true)
    } catch {
      setErro('Não foi possível registrar seu pedido. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <p className="text-xs text-signal-green">
        Prontinho! Vamos te avisar por WhatsApp assim que este produto voltar ao estoque.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-xs font-medium text-hull-900">
        <BellRing className="h-3.5 w-3.5" strokeWidth={1.75} />
        Avise-me quando chegar
      </p>
      {erro && <p className="text-xs text-signal-red">{erro}</p>}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome"
          className="rounded-md border border-foam-200 px-3 py-2 text-sm text-hull-900 focus:border-wake-400 focus:outline-none"
        />
        <input
          value={telefone}
          onChange={(e) => setTelefone(e.target.value)}
          placeholder="Seu WhatsApp"
          className="rounded-md border border-foam-200 px-3 py-2 text-sm text-hull-900 focus:border-wake-400 focus:outline-none"
        />
        <button
          onClick={enviar}
          disabled={enviando || !nome.trim() || !telefone.trim()}
          className="shrink-0 rounded-md bg-hull-900 px-4 py-2 text-xs font-medium text-foam-50 disabled:opacity-50"
        >
          {enviando ? 'Enviando…' : 'Avisar'}
        </button>
      </div>
    </div>
  )
}

export default function ProdutoDetalhe({
  produto,
  subcategoria,
  campos,
  selecionado,
  onToggleSelecao,
  onClose,
}: {
  produto: ProdutoPublico
  subcategoria: SubcategoriaProduto | undefined
  campos: CampoPersonalizado[]
  selecionado: boolean
  onToggleSelecao: () => void
  onClose: () => void
}) {
  const [fotos, setFotos] = useState<FotoProduto[]>([])
  const [itensInclusos, setItensInclusos] = useState<ProdutoItemIncluso[]>([])

  useEffect(() => {
    listFotosProduto(produto.id).then(setFotos)
    if (subcategoria?.vendido_como_esta) {
      listItensInclusosProduto(produto.id).then(setItensInclusos)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produto.id])

  const vendidoComoEsta = subcategoria?.vendido_como_esta ?? false
  const requerMotor = subcategoria?.requer_motor ?? true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-hull-950/60 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white">
        <div className="flex items-center justify-between border-b border-foam-200 px-6 py-4">
          <h2 className="font-display text-xl text-hull-900">{produto.nome}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-hull-900">
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="space-y-5 p-6">
          {fotos.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {fotos.map((foto) => (
                <img
                  key={foto.id}
                  src={foto.url_imagem}
                  alt={produto.nome}
                  className="aspect-video w-full rounded-md object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-md bg-hull-900/[0.04] text-sm text-slate-400">
              Sem fotos
            </div>
          )}

          <p className="text-sm leading-relaxed text-slate-600">{produto.descricao}</p>

          {vendidoComoEsta && (requerMotor || itensInclusos.length > 0) && (
            <div className="rounded-md border border-foam-200 p-4">
              {requerMotor && (
                <>
                  <p className="mb-2 text-sm font-medium text-hull-900">
                    Vendido como está — dados do checklist
                  </p>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                    {produto.ano && (
                      <>
                        <dt className="text-slate-400">Ano</dt>
                        <dd className="text-hull-900">{produto.ano}</dd>
                      </>
                    )}
                    {produto.motorizacao_tipo && (
                      <>
                        <dt className="text-slate-400">Motorização</dt>
                        <dd className="text-hull-900">{produto.motorizacao_tipo}</dd>
                      </>
                    )}
                    {produto.motorizacao_potencia && (
                      <>
                        <dt className="text-slate-400">Potência</dt>
                        <dd className="text-hull-900">{produto.motorizacao_potencia}</dd>
                      </>
                    )}
                    {produto.motorizacao_marca_modelo && (
                      <>
                        <dt className="text-slate-400">Marca/modelo do motor</dt>
                        <dd className="text-hull-900">{produto.motorizacao_marca_modelo}</dd>
                      </>
                    )}
                    {produto.combustivel && (
                      <>
                        <dt className="text-slate-400">Combustível</dt>
                        <dd className="text-hull-900">{produto.combustivel}</dd>
                      </>
                    )}
                    {produto.horas_uso && (
                      <>
                        <dt className="text-slate-400">Horas de uso</dt>
                        <dd className="text-hull-900">{produto.horas_uso}</dd>
                      </>
                    )}
                    {produto.ultima_revisao && (
                      <>
                        <dt className="text-slate-400">Última revisão</dt>
                        <dd className="text-hull-900">{produto.ultima_revisao}</dd>
                      </>
                    )}
                  </dl>
                </>
              )}
              {itensInclusos.length > 0 && (
                <div className={requerMotor ? 'mt-3 border-t border-foam-200 pt-3' : ''}>
                  <p className="mb-1.5 text-xs font-medium text-hull-900">Itens inclusos</p>
                  <ul className="space-y-1 text-xs text-slate-500">
                    {itensInclusos.map((item) => (
                      <li key={item.id}>
                        {item.nome}
                        {item.descricao ? ` — ${item.descricao}` : ''}
                        {item.quantidade ? ` (x${item.quantidade})` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {campos.length > 0 && (
            <div className="rounded-md border border-foam-200 p-4">
              <p className="mb-2 text-sm font-medium text-hull-900">Informações adicionais</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {campos.map((campo) => {
                  const valorFormatado = formatarValorCampo(campo, produto.atributos?.[campo.id] ?? null)
                  if (valorFormatado === null) return null
                  return (
                    <div key={campo.id} className="contents">
                      <dt className="text-slate-400">{campo.nome}</dt>
                      <dd className="text-hull-900">{valorFormatado}</dd>
                    </div>
                  )
                })}
              </dl>
            </div>
          )}

          {produto.status_estoque === 'esgotado' && (
            <div className="rounded-md border border-foam-200 bg-hull-900/[0.02] p-4">
              <p className="mb-2 text-xs font-medium text-signal-red">
                Esgotado
                {produto.data_reposicao
                  ? ` — previsão de reposição em ${new Date(produto.data_reposicao + 'T00:00:00').toLocaleDateString('pt-BR')}`
                  : ''}
              </p>
              <AvisoReposicaoForm produtoId={produto.id} />
            </div>
          )}

          <div className="flex items-center justify-between border-t border-foam-200 pt-4">
            <span className="font-mono text-lg text-hull-900">{formatPreco(produto.preco_base)}</span>
            <button
              onClick={onToggleSelecao}
              className={`flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                selecionado
                  ? 'border-brass-500 bg-brass-200/30 text-hull-900'
                  : 'border-foam-200 text-slate-500 hover:border-wake-400'
              }`}
            >
              {selecionado ? (
                <>
                  <Check className="h-4 w-4" strokeWidth={2} />
                  Selecionado
                </>
              ) : (
                'Selecionar'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
