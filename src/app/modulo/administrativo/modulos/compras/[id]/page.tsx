'use client'

import { useEmpresa } from '@/lib/CaseAtom'
import { useQuery } from '@tanstack/react-query'
import { ListaEmpresas } from '../../../empresa/components/selects/ListaEmpresas'
import { buscarItensAvaliativosRecebimentoEmpresa } from '../../_api/AdmCompras'
import { TabelaItensAvaliacaoEmpresa } from '../components/tabelas/tabela-itens-avaliacao'
import { listarEmpresas } from '../../../empresa/api/Empresa'

export default function AdmComprasPage() {
  const [empresaSelecionada] = useEmpresa()

  const { data: dadosEmpresas, isFetching: carregandoDados } = useQuery({
      queryKey: ['empresas'],
      queryFn: listarEmpresas,
      initialData: [],
    })

  const itensAvaliativosRecebimentoEmpresa = useQuery({
    queryKey: [
      'itensAvaliativoRecebimentoEmpresa',
      empresaSelecionada.selected,
    ],
    queryFn: () =>
      buscarItensAvaliativosRecebimentoEmpresa(
        empresaSelecionada.selected ?? ''
      ),
    enabled: !!empresaSelecionada.selected,
    initialData: [],
  })

  return (
    <div className="space-y-4">
      <section className="shadow-lg rounded-lg p-4 bg-zinc-200 space-y-2">
        <div className="flex flex-row justify-center md:justify-start space-x-2">
          <ListaEmpresas listaEmpresas={dadosEmpresas} carregandoDados={carregandoDados} />
        </div>
      </section>
      <section>
        <TabelaItensAvaliacaoEmpresa
          empresaId={empresaSelecionada.selected ?? ''}
          listaItensAvaliacao={itensAvaliativosRecebimentoEmpresa.data}
          carregandoItens={itensAvaliativosRecebimentoEmpresa.isLoading}
        />
      </section>
    </div>
  )
}
