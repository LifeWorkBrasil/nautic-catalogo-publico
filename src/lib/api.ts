import { supabase, EMPRESA_ID } from './supabase'
import type {
  CategoriaProduto,
  SubcategoriaProduto,
  GrupoProduto,
  CampoPersonalizado,
  ProdutoPublico,
  FotoProduto,
  ProdutoItemIncluso,
  EmpresaConfig,
} from '../types'

export async function listCategorias(): Promise<CategoriaProduto[]> {
  const { data, error } = await supabase
    .from('categorias_produto')
    .select('*')
    .eq('empresa_id', EMPRESA_ID)
    .order('ordem')
  if (error) throw error
  return data ?? []
}

export async function listSubcategorias(): Promise<SubcategoriaProduto[]> {
  const { data, error } = await supabase
    .from('subcategorias_produto')
    .select('*')
    .eq('empresa_id', EMPRESA_ID)
    .order('ordem')
  if (error) throw error
  return data ?? []
}

export async function listGrupos(): Promise<GrupoProduto[]> {
  const { data, error } = await supabase
    .from('grupos_produto')
    .select('*')
    .eq('empresa_id', EMPRESA_ID)
    .order('ordem')
  if (error) throw error
  return data ?? []
}

export async function listCamposPersonalizados(): Promise<CampoPersonalizado[]> {
  const { data, error } = await supabase.from('campos_personalizados').select('*').order('ordem')
  if (error) throw error
  return data ?? []
}

export async function listProdutos(): Promise<ProdutoPublico[]> {
  const [{ data: produtos, error: produtosError }, { data: fotos, error: fotosError }] =
    await Promise.all([
      supabase.from('produtos_publicos').select('*').eq('empresa_id', EMPRESA_ID).order('nome'),
      supabase.from('fotos_produto').select('produto_id, url_imagem, principal, empresa_id').eq('empresa_id', EMPRESA_ID),
    ])
  if (produtosError) throw produtosError
  if (fotosError) throw fotosError

  const fotosPorProduto = new Map<string, { url_imagem: string; principal: boolean }[]>()
  for (const foto of fotos ?? []) {
    const lista = fotosPorProduto.get(foto.produto_id) ?? []
    lista.push(foto)
    fotosPorProduto.set(foto.produto_id, lista)
  }

  return (produtos ?? []).map((p) => {
    const fotosDoProduto = fotosPorProduto.get(p.id) ?? []
    return {
      ...p,
      foto_principal_url:
        fotosDoProduto.find((f) => f.principal)?.url_imagem ?? fotosDoProduto[0]?.url_imagem,
    }
  })
}

export async function listFotosProduto(produtoId: string): Promise<FotoProduto[]> {
  const { data, error } = await supabase
    .from('fotos_produto')
    .select('*')
    .eq('produto_id', produtoId)
    .order('principal', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function listItensInclusosProduto(produtoId: string): Promise<ProdutoItemIncluso[]> {
  const { data, error } = await supabase
    .from('produto_itens_inclusos')
    .select('*')
    .eq('produto_id', produtoId)
  if (error) throw error
  return data ?? []
}

export async function getEmpresaConfig(): Promise<EmpresaConfig | null> {
  const { data, error } = await supabase
    .from('empresa_config')
    .select('nome_empresa, logo_url, telefone')
    .eq('id', EMPRESA_ID)
    .maybeSingle()
  if (error) throw error
  return data
}
