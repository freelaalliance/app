'use client'

import { useEmpresa } from '@/lib/CaseAtom'
import { useQuery } from '@tanstack/react-query'
import { listarEmpresas } from '../../../empresa/api/Empresa'
import { ListaEmpresas } from '../../../empresa/components/selects/ListaEmpresas'
import { buscarItensAvaliativosExpedicaoEmpresa } from '../../_api/AdmVendas'
import { TabelaItensAvaliacaoExpedicaoEmpresa } from '../components/tabelas/tabela-itens-avaliacao'

export default function AdmVendasPage() {
  const [empresaSelecionada] = useEmpresa()

  const { data: dadosEmpresas, isFetching: carregandoDados } = useQuery({
      queryKey: ['empresas'],
      queryFn: listarEmpresas,
      initialData: [],
    })

  const itensAvaliativosExpedicaoEmpresa = useQuery({
    queryKey: [
      'itensAvaliativoExpedicaoEmpresa',
      empresaSelecionada.selected,
    ],
    queryFn: () => buscarItensAvaliativosExpedicaoEmpresa(empresaSelecionada.selected ?? ''),
    enabled: !!empresaSelecionada.selected,
    initialData: {
      status: false,
      dados: [],
    },
  })

  return (
    <div className="space-y-4">
      <section className="shadow-lg rounded-lg p-4 bg-zinc-200 space-y-2">
        <div className="flex flex-row justify-center md:justify-start space-x-2">
          <ListaEmpresas listaEmpresas={dadosEmpresas} carregandoDados={carregandoDados} />
        </div>
      </section>
      <section>
        <TabelaItensAvaliacaoExpedicaoEmpresa
          empresaId={empresaSelecionada.selected ?? ''}
          listaItensAvaliacaoExpedicao={itensAvaliativosExpedicaoEmpresa.data.dados}
          carregandoItens={itensAvaliativosExpedicaoEmpresa.isLoading}
        />
      </section>
    </div>
  )
}
