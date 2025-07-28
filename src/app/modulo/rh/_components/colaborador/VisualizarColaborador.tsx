'use client'

import { downloadFile } from '@/app/modulo/documentos/[id]/novo/_actions/upload-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Building,
  Calendar,
  Download,
  FileText,
  GraduationCap,
  Info,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Upload,
  User
} from 'lucide-react'

import { aplicarMascaraDocumento } from '@/lib/utils'
import type { EmailPessoa, TelefonePessoa } from '@/types/PessoaType'
import { useState } from 'react'
import { toast } from 'sonner'
import { useContratacao, useDocumentosContrato } from '../../_hooks/colaborador/useContratacaoColaborador'
import { useIniciarTreinamentosObrigatorios, useTreinamentosPorColaborador } from '../../_hooks/colaborador/useTreinamentosColaborador'
import { useTreinamentosCapacitacao, useTreinamentosIntegracaoPorCargo } from '../../_hooks/treinamentos/useTreinamentos'
import type { DocumentoContrato } from '../../_types/colaborador/ContratacaoType'
import { CardTreinamento } from '../cards/CardTreinamento'
import { CardTreinamentoDisponivel } from '../cards/CardTreinamentoDisponivel'
import { AlertDialogRemoverDocumento } from '../dialogs/colaborador/AlertDialogRemoverDocumento'
import { DialogAdicionarDocumento } from '../dialogs/colaborador/DialogAdicionarDocumento'
import { DialogEditarColaborador } from '../dialogs/colaborador/DialogEditarColaborador'
import { DialogTreinamentosNaoRealizados } from '../dialogs/colaborador/DialogTreinamentosNaoRealizados'
import { PopoverAcoesColaborador } from '../dialogs/colaborador/PopoverAcoesColaborador'
import { DocumentoSkeleton } from '../skeletons/DocumentoSkeleton'
import { DialogUploadDocumento } from './DialogUploadDocumento'

interface VisualizarColaboradorProps {
  contratacaoId: string
}

export function VisualizarColaborador({ contratacaoId }: VisualizarColaboradorProps) {
  const { data: contratacao, isFetching } = useContratacao(contratacaoId)
  const { data: documentosContrato, isFetching: isFetchingDocumentos } = useDocumentosContrato(contratacaoId)
  const { data: treinamentosRealizados, isFetching: isFetchingTreinamentos } = useTreinamentosPorColaborador(contratacaoId)
  
  // Buscar treinamentos disponíveis baseados no cargo do colaborador
  const { data: treinamentosIntegracao } = useTreinamentosIntegracaoPorCargo(
    contratacao?.cargo?.id || ''
  )
  const { data: treinamentosCapacitacao } = useTreinamentosCapacitacao()
  
  const iniciarTreinamentosObrigatorios = useIniciarTreinamentosObrigatorios()
  
  const [documentoParaUpload, setDocumentoParaUpload] = useState<DocumentoContrato | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [treinamentosNaoRealizadosDialogOpen, setTreinamentosNaoRealizadosDialogOpen] = useState(false)

  // Função para verificar se um treinamento já foi realizado
  const treinamentoJaRealizado = (treinamentoId: string) => {
    return treinamentosRealizados?.some(tr => tr.treinamento.id === treinamentoId) || false
  }

  // Obter treinamentos de integração não realizados
  const treinamentosIntegracaoDisponiveis = treinamentosIntegracao?.filter(
    t => !treinamentoJaRealizado(t.id)
  ) || []

  // Obter treinamentos de capacitação não realizados
  const treinamentosCapacitacaoDisponiveis = treinamentosCapacitacao?.filter(
    t => !treinamentoJaRealizado(t.id)
  ) || []

  // Contar treinamentos em andamento (pendentes)
  const treinamentosEmAndamento = treinamentosRealizados?.filter(tr => 
    tr.iniciadoEm && !tr.finalizadoEm
  ).length || 0

  // Total de itens para o badge: disponíveis + em andamento
  const totalTreinamentosParaBadge = treinamentosIntegracaoDisponiveis.length + 
                                     treinamentosCapacitacaoDisponiveis.length + 
                                     treinamentosEmAndamento

  const handleIniciarTreinamentosObrigatorios = () => {
    iniciarTreinamentosObrigatorios.mutate(contratacaoId, {
      onSuccess: (data) => {
        const resultado = data.data.dados
        if (resultado) {
          const { treinamentosIniciados, treinamentosJaExistentes, total } = resultado
          toast.success(
            `${treinamentosIniciados} treinamentos iniciados com sucesso! ` +
            `(${treinamentosJaExistentes} já existiam de ${total} total)`
          )
        } else {
          toast.success('Treinamentos obrigatórios iniciados com sucesso!')
        }
      },
      onError: (error) => {
        console.error('Erro ao iniciar treinamentos obrigatórios:', error)
        toast.error('Erro ao iniciar treinamentos obrigatórios. Tente novamente.')
      },
    })
  }

  const handleAbrirUpload = (documento: DocumentoContrato) => {
    setDocumentoParaUpload(documento)
    setUploadDialogOpen(true)
  }

  const formatarCEP = (cep: string) => {
    const cleaned = cep.replace(/\D/g, '')
    if (cleaned.length === 8) {
      return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
    }
    return cep
  }

  const formatarTelefone = (telefone: string) => {
    const cleaned = telefone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
    }
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
    }
    return telefone
  }

  const handleDownloadArquivo = async (chaveArquivo: string, nomeDocumento: string) => {
    try {
      const url = await downloadFile(chaveArquivo)
      if (url) {
        // Criar link temporário para download
        const link = document.createElement('a')
        link.href=url
        link.download=nomeDocumento
        link.target='_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        toast.error('Erro ao baixar arquivo')
      }
    } catch (error) {
      console.error('Erro no download:', error)
      toast.error(`Erro no download: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="mt-2 text-sm text-muted-foreground">Carregando dados do colaborador...</p>
        </div>
      </div>
    )
  }

  if (!contratacao) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Colaborador não encontrado</p>
      </div>
    )
  }

  const { colaborador, cargo, admitidoEm, demitidoEm } = contratacao

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className='flex md:flex-row flex-col justify-between'>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>Dados Pessoais</CardTitle>
          </div>
          <DialogEditarColaborador contratacao={contratacao} />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Nome Completo</span>
              <p className="text-sm">{colaborador.pessoa.nome}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-muted-foreground">Documento (CPF)</span>
              <p className="text-sm">{aplicarMascaraDocumento(colaborador.documento)}</p>
            </div>
          </div>
          <>
            <Separator />
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Endereço</h4>
              </div>
              {colaborador.pessoa.Endereco ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">CEP</span>
                    <p>{colaborador.pessoa.Endereco.cep ? formatarCEP(colaborador.pessoa.Endereco.cep) : 'Não informado'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-xs font-medium text-muted-foreground">Logradouro</span>
                    <p>
                      {colaborador.pessoa.Endereco.logradouro || 'Não informado'}
                      {colaborador.pessoa.Endereco.numero && `, ${colaborador.pessoa.Endereco.numero}`}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Bairro</span>
                    <p>{colaborador.pessoa.Endereco.bairro || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Cidade</span>
                    <p>{colaborador.pessoa.Endereco.cidade || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Estado</span>
                    <p>{colaborador.pessoa.Endereco.estado || 'Não informado'}</p>
                  </div>
                  {colaborador.pessoa.Endereco.complemento && (
                    <div className="lg:col-span-3">
                      <span className="text-xs font-medium text-muted-foreground">Complemento</span>
                      <p>{colaborador.pessoa.Endereco.complemento}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 text-muted-foreground bg-muted/20 rounded-lg">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Nenhum endereço cadastrado</p>
                </div>
              )}
            </div>
          </>

          {/* Contatos */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Telefones */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Telefones</h4>
              </div>
              {colaborador.pessoa.TelefonePessoa && colaborador.pessoa.TelefonePessoa.length > 0 ? (
                <div className="space-y-2">
                  {colaborador.pessoa.TelefonePessoa.map((telefone: TelefonePessoa, index: number) => (
                    <p key={`telefone-${index}-${telefone.numero}`} className="text-sm">
                      {formatarTelefone(telefone.numero)}
                    </p>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground bg-muted/20 rounded-lg">
                  <Phone className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhum telefone cadastrado</p>
                </div>
              )}
            </div>

            {/* E-mails */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="h-4 w-4 text-primary" />
                <h4 className="font-medium">E-mails</h4>
              </div>
              {colaborador.pessoa.EmailPessoa && colaborador.pessoa.EmailPessoa.length > 0 ? (
                <div className="space-y-2">
                  {colaborador.pessoa.EmailPessoa.map((email: EmailPessoa, index: number) => (
                    <p key={`email-${index}-${email.email}`} className="text-sm">{email.email}</p>
                  ))}
                </div>
              ) : (
                <div className="text-center p-4 text-muted-foreground bg-muted/20 rounded-lg">
                  <Mail className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">Nenhum e-mail cadastrado</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Informações e Treinamentos */}
      <Tabs defaultValue="informacoes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="informacoes" className="flex items-center gap-2">
            <Info className="h-4 w-4" />
            Informações
          </TabsTrigger>
          <TabsTrigger value="treinamentos" className="flex items-center gap-2 relative">
            <GraduationCap className="h-4 w-4" />
            Treinamentos
            {/* Badge indicando treinamentos disponíveis e em andamento */}
            {totalTreinamentosParaBadge > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                {totalTreinamentosParaBadge}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="informacoes" className="space-y-6">
          {/* Dados do Contrato */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-primary" />
                  <CardTitle>Informações do Contrato</CardTitle>
                </div>
                {!demitidoEm && (
                  <PopoverAcoesColaborador contratacao={contratacao} />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Cargo</span>
                  <p className="text-sm font-medium">{cargo.nome}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Data de Admissão</span>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">{new Date(admitidoEm).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                {demitidoEm && (
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Data de Demissão</span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm">{new Date(demitidoEm).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documentos do Contrato */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Documentos do Contrato</CardTitle>
                </div>
                <DialogAdicionarDocumento contratacaoId={contratacaoId} />
              </div>
            </CardHeader>
            <CardContent>
              {isFetchingDocumentos ? (
                <DocumentoSkeleton count={2} />
              ) : documentosContrato && documentosContrato.length > 0 ? (
                <div className="space-y-3">
                  {documentosContrato.map((documento: DocumentoContrato, index: number) => (
                    <div key={`documento-${documento.id || index}-${documento.documento}`} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <h4 className="font-medium">{documento.documento}</h4>
                            <p className="text-xs text-muted-foreground">
                              {documento.chaveArquivo ? 'Arquivo disponível' : 'Nenhum arquivo anexado'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {documento.chaveArquivo ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadArquivo(documento.chaveArquivo || '', documento.documento)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Baixar
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAbrirUpload(documento)}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Enviar Arquivo
                            </Button>
                          )}
                          <AlertDialogRemoverDocumento documento={documento}>
                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          </AlertDialogRemoverDocumento>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="mb-4">Nenhum documento anexado ao contrato</p>
                  <DialogAdicionarDocumento contratacaoId={contratacaoId}>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      Adicionar Primeiro Documento
                    </Button>
                  </DialogAdicionarDocumento>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="treinamentos" className="space-y-6">
          {/* Cabeçalho com botões de ações */}
          <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
            <div>
              <h3 className="text-lg font-medium">Gerenciar Treinamentos</h3>
              <p className="text-sm text-muted-foreground">
                Visualize e gerencie os treinamentos do colaborador
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setTreinamentosNaoRealizadosDialogOpen(true)}
                className="border-green-200 text-green-700 hover:bg-green-50"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Ver Treinamentos Disponíveis
              </Button>
              {treinamentosIntegracaoDisponiveis.length > 0 && (
                <Button 
                  onClick={handleIniciarTreinamentosObrigatorios}
                  disabled={iniciarTreinamentosObrigatorios.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  {iniciarTreinamentosObrigatorios.isPending ? 'Iniciando...' : 'Iniciar Todos Obrigatórios'}
                </Button>
              )}
            </div>
          </div>

          {isFetchingTreinamentos ? (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={`skeleton-${Math.random()}`} className="animate-pulse">
                      <div className="h-20 bg-gray-200 rounded-lg" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Treinamentos de Integração */}
              {((treinamentosRealizados?.filter(t => t.treinamento.tipo === 'integracao').length ?? 0) > 0 || 
                treinamentosIntegracaoDisponiveis.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-blue-600" />
                      Treinamentos de Integração
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Treinamentos Realizados */}
                      {treinamentosRealizados
                        ?.filter(treinamento => treinamento.treinamento.tipo === 'integracao')
                        .map((treinamento, index) => (
                          <CardTreinamento
                            key={`integracao-realizado-${treinamento.id || index}`}
                            treinamento={treinamento}
                          />
                        ))}
                      
                      {/* Treinamentos Disponíveis */}
                      {treinamentosIntegracaoDisponiveis.map((treinamento, index) => (
                        <CardTreinamentoDisponivel
                          key={`integracao-disponivel-${treinamento.id || index}`}
                          treinamento={treinamento}
                          contratacaoId={contratacaoId}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Treinamentos de Capacitação */}
              {((treinamentosRealizados?.filter(t => t.treinamento.tipo === 'capacitacao').length ?? 0) > 0 || 
                treinamentosCapacitacaoDisponiveis.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      Treinamentos de Capacitação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Treinamentos Realizados */}
                      {treinamentosRealizados
                        ?.filter(treinamento => treinamento.treinamento.tipo === 'capacitacao')
                        .map((treinamento, index) => (
                          <CardTreinamento
                            key={`capacitacao-realizado-${treinamento.id || index}`}
                            treinamento={treinamento}
                          />
                        ))}
                      
                      {/* Treinamentos Disponíveis */}
                      {treinamentosCapacitacaoDisponiveis.map((treinamento, index) => (
                        <CardTreinamentoDisponivel
                          key={`capacitacao-disponivel-${treinamento.id || index}`}
                          treinamento={treinamento}
                          contratacaoId={contratacaoId}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mensagem quando não há treinamentos */}
              {(!treinamentosRealizados || treinamentosRealizados.length === 0) && 
               treinamentosIntegracaoDisponiveis.length === 0 && 
               treinamentosCapacitacaoDisponiveis.length === 0 && (
                <Card>
                  <CardContent className="text-center p-8">
                    <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                    <h3 className="font-medium mb-2">Nenhum treinamento disponível</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Não há treinamentos configurados para este cargo ou colaborador.
                    </p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <DialogUploadDocumento
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        documento={documentoParaUpload}
        contratacaoId={contratacaoId}
      />

      <DialogTreinamentosNaoRealizados
        open={treinamentosNaoRealizadosDialogOpen}
        onOpenChange={setTreinamentosNaoRealizadosDialogOpen}
        contratacaoId={contratacaoId}
        nomeColaborador={colaborador.pessoa.nome}
      />
    </div>
  )
}
