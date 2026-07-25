export interface CategoriaProduto {
  id: string
  nome: string
  ordem: number
}

export interface SubcategoriaProduto {
  id: string
  categoria_id: string
  nome: string
  ordem: number
  vendido_como_esta: boolean
}

export interface GrupoProduto {
  id: string
  subcategoria_id: string
  nome: string
  ordem: number
}

export type TipoCampoPersonalizado = 'texto' | 'numero' | 'booleano' | 'selecao'

export interface CampoPersonalizado {
  id: string
  categoria_id: string | null
  grupo_id: string | null
  nome: string
  tipo: TipoCampoPersonalizado
  opcoes: string[] | null
  ordem: number
}

export interface ProdutoPublico {
  id: string
  nome: string
  descricao: string
  preco_base: number
  comprimento: number | null
  subcategoria_id: string
  grupo_id: string | null
  ano: number | null
  motorizacao_tipo: string | null
  motorizacao_potencia: string | null
  motorizacao_marca_modelo: string | null
  combustivel: string | null
  horas_uso: string | null
  ultima_revisao: string | null
  atributos: Record<string, string | number | boolean | null>
  foto_principal_url?: string
}

export interface FotoProduto {
  id: string
  produto_id: string
  url_imagem: string
  principal: boolean
}

export interface ProdutoItemIncluso {
  id: string
  produto_id: string
  nome: string
  descricao: string | null
  quantidade: number | null
  estado: string | null
  marca: string | null
}

export interface EmpresaConfig {
  nome_empresa: string
  logo_url: string | null
  telefone: string | null
}
