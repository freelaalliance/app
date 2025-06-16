'use client'

import { columnsVendasCliente } from '@/app/modulo/vendas/_components/vendas/tabelas/colunas-tabela-vendas-realizadas'
import { TabelaVendasCliente } from '@/app/modulo/vendas/_components/vendas/tabelas/vendas-realizadas'
import { useCliente } from '@/app/modulo/vendas/_servicos/useClientes'
import { useVendasByCliente } from '@/app/modulo/vendas/_servicos/useVendas'
import { EdicaoEnderecoDialog } from '@/components/dialogs/EdicaoEnderecoDialog'
import { NovoEmailPessoaDialog } from '@/components/dialogs/NovoEmailDialog'
import { NovoTelefonePessoaDialog } from '@/components/dialogs/NovoTelefoneDialog'
import { TabelaEmailsPessoa } from '@/components/tables/emails/tabela-email-pessoa'
import { TabelaTelefonesPessoa } from '@/components/tables/telefones/tabela-telefones-pessoa'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { aplicarMascaraDocumento } from '@/lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Pen, Plus } from 'lucide-react'
import { useParams } from 'next/navigation'


export default function ClienteDetalhesPage() {
  const queryClient = useQueryClient()
  const { idCliente } = useParams<{ idCliente: string }>()

  const { data, isFetching } = useCliente(idCliente)
  const {
    data: listaVendas,
    isFetching: carregandoVendasCliente
  } = useVendasByCliente(idCliente)

  if (isFetching) {
    return (
      <div className="grid space-y-2">
        {[...Array(2)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <Skeleton key={i} className="h-40 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  const atualizarDadosCliente = () => {
    queryClient.refetchQueries({
      queryKey: ['pessoa-cliente', idCliente],
      type: 'active',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-1 shadow rounded bg-zinc-200 p-4 space-x-2 justify-start items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={'link'}
              size={'icon'}
              onClick={() => {
                history.back()
              }}
            >
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para a tela anterior</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{`${data.pessoa.nome} - (${aplicarMascaraDocumento(data.documento)})`}</CardTitle>
          <CardDescription>Dados do Cliente</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <article className='text-wrap grid space-y-4'>
            <h2 className='text-lg font-semibold'>Observações do cliente:</h2>
            <p className='text-justify'>{data.observacoes || 'Sem observações'}</p>
          </article>
          <Separator />
          <Tabs defaultValue="endereco">
            <TabsList className="flex flex-row justify-start overflow-auto md:justify-center">
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="telefone">Telefones</TabsTrigger>
              <TabsTrigger value="email">Emails</TabsTrigger>
            </TabsList>
            <TabsContent value="endereco">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="space-y-2">
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>Endereço do cliente</CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size={'icon'}
                            className="shadow bg-padrao-red hover:bg-red-800"
                          >
                            <Pen className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <EdicaoEnderecoDialog
                          idPessoa={data.pessoa.id}
                          endereco={
                            data.pessoa.endereco ??
                            {
                              logradouro: '',
                              numero: '',
                              complemento: '',
                              bairro: '',
                              cidade: '',
                              estado: '',
                              cep: '',
                            }
                          }
                          enderecoAtualizado={atualizarDadosCliente}
                        />
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar os dados de endereço</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  {isFetching ? (
                    <ul className="grid space-y-2">
                      <li className="flex items-center">
                        <Skeleton className="w-80 h-4" />
                      </li>
                      <li className="flex items-center">
                        <Skeleton className="w-80 h-4" />
                      </li>
                      <li className="flex items-center">
                        <Skeleton className="w-80 h-4" />
                      </li>
                      <li className="flex items-center">
                        <Skeleton className="w-80 h-4" />
                      </li>
                      <li className="flex items-center">
                        <Skeleton className="w-80 h-4" />
                      </li>
                      <li className="flex items-center">
                        <Skeleton className="w-80 h-4" />
                      </li>
                    </ul>
                  ) : (
                    <ul className="grid">
                      <li className="flex items-center gap-2">
                        <strong>Logradouro:</strong>
                        <span>{` ${data.pessoa.endereco.logradouro ?? ''}`}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <strong>Número:</strong>
                        <span>{` ${data.pessoa.endereco.numero ?? ''}`}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <strong>Bairro:</strong>
                        <span>
                          {` ${data.pessoa.endereco.bairro ?? ''}`}
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <strong>Cidade:</strong>
                        <span>{` ${data.pessoa.endereco.cidade ?? ''} - ${data.pessoa.endereco.estado ?? ''}`}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <strong>CEP:</strong>
                        <span>{` ${data.pessoa.endereco.cep ?? ''}`}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <strong>Complemento:</strong>
                        <span>{` ${(data.pessoa.endereco.complemento !== ' ' || data.pessoa.endereco.complemento !== null) ? data.pessoa.endereco.complemento : 'Não informado'}`}</span>
                      </li>
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="telefone">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="space-y-2">
                    <CardTitle>Contato</CardTitle>
                    <CardDescription>
                      Informações de contato do cliente
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger>
                          <Button
                            size={'icon'}
                            className="shadow bg-padrao-red hover:bg-red-800"
                          >
                            <Plus className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <NovoTelefonePessoaDialog idPessoa={data.pessoa.id} atualizaTelefone={atualizarDadosCliente} />
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar novo telefone</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <TabelaTelefonesPessoa
                    listaTelefones={data.pessoa.telefones ?? []}
                    carregandoTelefones={isFetching}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="email">
              <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                  <div className="space-y-2">
                    <CardTitle>Emails</CardTitle>
                    <CardDescription>
                      Informações de emails do cliente
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Dialog>
                        <DialogTrigger>
                          <Button
                            size={'icon'}
                            className="shadow bg-padrao-red hover:bg-red-800"
                          >
                            <Plus className="size-4" />
                          </Button>
                        </DialogTrigger>
                        <NovoEmailPessoaDialog idPessoa={data.pessoa.id} emailAtualizado={atualizarDadosCliente} />
                      </Dialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar novo email</p>
                    </TooltipContent>
                  </Tooltip>
                </CardHeader>
                <CardContent>
                  <TabelaEmailsPessoa
                    listaEmails={data.pessoa.emails ?? []}
                    carregandoEmails={isFetching}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            Vendas realizadas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-4">
          <TabelaVendasCliente
            listaVendas={listaVendas}
            carregandoVendas={carregandoVendasCliente}
            colunasVenda={columnsVendasCliente}
            clienteId={idCliente}
            novaVenda={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}
