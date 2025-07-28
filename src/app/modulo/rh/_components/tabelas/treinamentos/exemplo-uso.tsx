// Exemplo de uso da TabelaTreinamentos

import type { TreinamentosType } from '../../../_types/treinamentos/TreinamentoType'
import { colunasTabelaTreinamentos } from './colunas-tabela-treinamentos'
import { TabelaTreinamentos } from './tabela'

// Exemplo de dados mock para teste
const dadosExemplo: TreinamentosType[] = [
  {
    id: '1',
    nome: 'Treinamento de Segurança no Trabalho',
    tipo: 'integracao',
    planos: [
      { id: '1', nome: 'Plano Básico de Segurança' },
      { id: '2', nome: 'Plano Avançado de Segurança' }
    ]
  },
  {
    id: '2',
    nome: 'Capacitação em Liderança',
    tipo: 'capacitacao',
    planos: [
      { id: '3', nome: 'Liderança Transformacional' }
    ]
  }
]

// Como usar o componente:
export function ExemploUsoTabelaTreinamentos() {
  const carregandoTreinamentos = false

  return (
    <TabelaTreinamentos
      listaTreinamentos={dadosExemplo}
      carregandoTreinamentos={carregandoTreinamentos}
      colunasTabela={colunasTabelaTreinamentos}
    />
  )
}

/*
Características implementadas:

1. ✅ Arquivo de colunas (colunas-tabela-treinamentos.tsx):
   - Coluna de ações com menu dropdown
   - Coluna de nome do treinamento
   - Coluna de tipo (Integração/Capacitação)
   - Coluna de planos com tooltip para múltiplos planos

2. ✅ Menu de ações (menu-tabela-treinamentos.tsx):
   - Opção de editar treinamento
   - Opção de excluir treinamento
   - Estrutura preparada para implementação das ações

3. ✅ Tabela principal (tabela.tsx):
   - Filtro por nome do treinamento
   - Skeleton de carregamento (3 linhas)
   - Mensagem quando não há dados
   - Paginação com botões Voltar/Próximo
   - Estrutura responsiva

4. ✅ Recursos implementados:
   - Filtro por nome do treinamento
   - Estado de carregamento com skeleton
   - Menu de ações (editar/excluir)
   - Paginação
   - Tratamento de dados vazios
   - Interface tipada com TypeScript

Para usar esta tabela, você precisa:
1. Importar o componente TabelaTreinamentos
2. Importar as colunas colunasTabelaTreinamentos
3. Passar os dados de treinamentos e o estado de carregamento
4. Implementar as funções de editar e excluir no menu-tabela-treinamentos.tsx
*/
