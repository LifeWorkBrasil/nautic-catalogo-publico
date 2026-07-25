import { useEffect, useMemo, useState } from 'react'
import { Building2 } from 'lucide-react'
import {
  listCategorias,
  listSubcategorias,
  listGrupos,
  listCamposPersonalizados,
  listProdutos,
  getEmpresaConfig,
} from './lib/api'
import { montarMensagem, linkWhatsapp } from './lib/whatsapp'
import ProdutoCard from './components/ProdutoCard'
import ProdutoDetalhe from './components/ProdutoDetalhe'
import SelecaoBar from './components/SelecaoBar'
import type {
  CategoriaProduto,
  SubcategoriaProduto,
  GrupoProduto,
  CampoPersonalizado,
  ProdutoPublico,
  EmpresaConfig,
} from './types'

export default function App() {
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  const [categorias, setCategorias] = useState<CategoriaProduto[]>([])
  const [subcategorias, setSubcategorias] = useState<SubcategoriaProduto[]>([])
  const [grupos, setGrupos] = useState<GrupoProduto[]>([])
  const [campos, setCampos] = useState<CampoPersonalizado[]>([])
  const [produtos, setProdutos] = useState<ProdutoPublico[]>([])
  const [empresa, setEmpresa] = useState<EmpresaConfig | null>(null)

  const [categoriaAtivaId, setCategoriaAtivaId] = useState<string | null>(null)
  const [subcategoriaAtivaId, setSubcategoriaAtivaId] = useState<string | null>(null)
  const [grupoAtivoId, setGrupoAtivoId] = useState<string | null>(null)
  const [produtoAbertoId, setProdutoAbertoId] = useState<string | null>(null)
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function carregar() {
      try {
        const [c, s, g, cp, p, e] = await Promise.all([
          listCategorias(),
          listSubcategorias(),
          listGrupos(),
          listCamposPersonalizados(),
          listProdutos(),
          getEmpresaConfig(),
        ])
        setCategorias(c)
        setSubcategorias(s)
        setGrupos(g)
        setCampos(cp)
        setProdutos(p)
        setEmpresa(e)
        setCategoriaAtivaId((atual) => atual ?? c[0]?.id ?? null)
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Erro ao carregar catálogo')
      } finally {
        setCarregando(false)
      }
    }
    carregar()
  }, [])

  const subcategoriasDaCategoria = useMemo(
    () => subcategorias.filter((s) => s.categoria_id === categoriaAtivaId),
    [subcategorias, categoriaAtivaId]
  )

  const gruposDaSubcategoriaAtiva = useMemo(
    () => grupos.filter((g) => g.subcategoria_id === subcategoriaAtivaId),
    [grupos, subcategoriaAtivaId]
  )

  const produtosVisiveis = useMemo(() => {
    const idsSubcategoriasDaCategoria = new Set(subcategoriasDaCategoria.map((s) => s.id))
    return produtos.filter((p) => {
      if (!idsSubcategoriasDaCategoria.has(p.subcategoria_id)) return false
      if (subcategoriaAtivaId && p.subcategoria_id !== subcategoriaAtivaId) return false
      if (grupoAtivoId && p.grupo_id !== grupoAtivoId) return false
      return true
    })
  }, [produtos, subcategoriasDaCategoria, subcategoriaAtivaId, grupoAtivoId])

  const produtoAberto = produtos.find((p) => p.id === produtoAbertoId) ?? null
  const subcategoriaDoProdutoAberto = subcategorias.find(
    (s) => s.id === produtoAberto?.subcategoria_id
  )
  const camposDoProdutoAberto = campos.filter(
    (c) =>
      c.categoria_id === subcategoriaDoProdutoAberto?.categoria_id ||
      (produtoAberto?.grupo_id && c.grupo_id === produtoAberto.grupo_id)
  )
  const produtosSelecionados = produtos.filter((p) => selecionados.has(p.id))

  function toggleSelecao(id: string) {
    setSelecionados((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function enviarWhatsapp() {
    if (!empresa?.telefone || produtosSelecionados.length === 0) return
    const mensagem = montarMensagem(produtosSelecionados)
    window.open(linkWhatsapp(empresa.telefone, mensagem), '_blank')
  }

  if (carregando) {
    return <div className="flex min-h-screen items-center justify-center bg-foam-100 text-sm text-slate-400">Carregando…</div>
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="border-b border-foam-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-5 sm:px-8">
          {empresa?.logo_url ? (
            <img src={empresa.logo_url} alt={empresa.nome_empresa} className="h-10 w-10 object-contain" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-hull-900/[0.06] text-slate-400">
              <Building2 className="h-5 w-5" strokeWidth={1.5} />
            </div>
          )}
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-wake-500">Catálogo</p>
            <h1 className="wake-underline inline-block font-display text-2xl text-hull-900">
              {empresa?.nome_empresa ?? 'Nosso catálogo'}
            </h1>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-8">
        {erro && (
          <div className="mb-5 rounded-md border border-signal-red/30 bg-signal-red/5 px-4 py-2.5 text-sm text-signal-red">
            {erro}
          </div>
        )}

        <div className="mb-4 flex gap-2">
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setCategoriaAtivaId(c.id)
                setSubcategoriaAtivaId(null)
                setGrupoAtivoId(null)
              }}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                categoriaAtivaId === c.id
                  ? 'bg-hull-900 text-foam-50'
                  : 'bg-white text-slate-500 hover:text-hull-900'
              }`}
            >
              {c.nome}
            </button>
          ))}
        </div>

        {subcategoriasDaCategoria.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSubcategoriaAtivaId(null)
                setGrupoAtivoId(null)
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                subcategoriaAtivaId === null
                  ? 'border-brass-500 bg-brass-200/30 text-hull-900'
                  : 'border-foam-200 text-slate-500 hover:border-wake-400'
              }`}
            >
              Todas
            </button>
            {subcategoriasDaCategoria.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSubcategoriaAtivaId(s.id)
                  setGrupoAtivoId(null)
                }}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  subcategoriaAtivaId === s.id
                    ? 'border-brass-500 bg-brass-200/30 text-hull-900'
                    : 'border-foam-200 text-slate-500 hover:border-wake-400'
                }`}
              >
                {s.nome}
              </button>
            ))}
          </div>
        )}

        {subcategoriaAtivaId && gruposDaSubcategoriaAtiva.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setGrupoAtivoId(null)}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                grupoAtivoId === null
                  ? 'border-brass-500 bg-brass-200/30 text-hull-900'
                  : 'border-foam-200 text-slate-500 hover:border-wake-400'
              }`}
            >
              Todos
            </button>
            {gruposDaSubcategoriaAtiva.map((g) => (
              <button
                key={g.id}
                onClick={() => setGrupoAtivoId(g.id)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  grupoAtivoId === g.id
                    ? 'border-brass-500 bg-brass-200/30 text-hull-900'
                    : 'border-foam-200 text-slate-500 hover:border-wake-400'
                }`}
              >
                {g.nome}
              </button>
            ))}
          </div>
        )}

        {produtosVisiveis.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum produto disponível nesta categoria ainda.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {produtosVisiveis.map((p) => (
              <ProdutoCard
                key={p.id}
                produto={p}
                selecionado={selecionados.has(p.id)}
                onAbrir={() => setProdutoAbertoId(p.id)}
                onToggleSelecao={() => toggleSelecao(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {produtoAberto && (
        <ProdutoDetalhe
          produto={produtoAberto}
          subcategoria={subcategoriaDoProdutoAberto}
          campos={camposDoProdutoAberto}
          selecionado={selecionados.has(produtoAberto.id)}
          onToggleSelecao={() => toggleSelecao(produtoAberto.id)}
          onClose={() => setProdutoAbertoId(null)}
        />
      )}

      <SelecaoBar
        selecionados={produtosSelecionados}
        onRemover={toggleSelecao}
        onLimpar={() => setSelecionados(new Set())}
        onEnviar={enviarWhatsapp}
      />
    </div>
  )
}
