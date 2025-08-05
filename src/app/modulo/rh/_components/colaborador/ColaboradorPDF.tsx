'use client'

import { aplicarMascaraDocumento } from '@/lib/utils'
import type { EmailPessoa, TelefonePessoa } from '@/types/PessoaType'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  Building, Clock, GraduationCap,
  Mail,
  MapPin,
  Phone,
  User
} from 'lucide-react'
import type { Contratacao, HistoricoContratacao } from '../../_types/colaborador/ContratacaoType'
import type { TreinamentoRealizado } from '../../_types/colaborador/ContratacaoType'

interface ColaboradorPDFProps {
  contratacao: Contratacao
  historicoContratacao: HistoricoContratacao[]
  treinamentosRealizados: TreinamentoRealizado[]
}

export function ColaboradorPDF({ 
  contratacao, 
  historicoContratacao = [], 
  treinamentosRealizados = [] 
}: ColaboradorPDFProps) {
  const { colaborador, cargo, admitidoEm, demitidoEm } = contratacao

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

  return (
    <div className="p-8 bg-white text-black min-h-screen" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Cabeçalho */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold text-gray-800">Relatório do Colaborador</h1>
        <p className="text-gray-600 mt-2">Gerado em {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
      </div>

      <div className='space-y-4'>
        {/* Dados Pessoais */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          <User className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Dados Pessoais</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Nome Completo</p>
            <p className="text-base font-semibold">{colaborador.pessoa.nome}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Documento (CPF)</p>
            <p className="text-base">{aplicarMascaraDocumento(colaborador.documento)}</p>
          </div>
        </div>

        {/* Endereço */}
        {colaborador.pessoa.Endereco && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-gray-700">Endereço</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">CEP</p>
                <p>{colaborador.pessoa.Endereco.cep ? formatarCEP(colaborador.pessoa.Endereco.cep) : 'Não informado'}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium text-gray-600">Logradouro</p>
                <p>
                  {colaborador.pessoa.Endereco.logradouro || 'Não informado'}
                  {colaborador.pessoa.Endereco.numero && `, ${colaborador.pessoa.Endereco.numero}`}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Bairro</p>
                <p>{colaborador.pessoa.Endereco.bairro || 'Não informado'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Cidade</p>
                <p>{colaborador.pessoa.Endereco.cidade || 'Não informado'}</p>
              </div>
              <div>
                <p className="font-medium text-gray-600">Estado</p>
                <p>{colaborador.pessoa.Endereco.estado || 'Não informado'}</p>
              </div>
              {colaborador.pessoa.Endereco.complemento && (
                <div className="col-span-3">
                  <p className="font-medium text-gray-600">Complemento</p>
                  <p>{colaborador.pessoa.Endereco.complemento}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contatos */}
        <div className="grid grid-cols-2 gap-6">
          {/* Telefones */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Phone className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-gray-700">Telefones</h3>
            </div>
            {colaborador.pessoa.TelefonePessoa && colaborador.pessoa.TelefonePessoa.length > 0 ? (
              <div className="space-y-1">
                {colaborador.pessoa.TelefonePessoa.map((telefone: TelefonePessoa) => (
                  <p key={`telefone-pdf-${telefone.numero}`} className="text-sm">
                    {formatarTelefone(telefone.numero)}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum telefone cadastrado</p>
            )}
          </div>

          {/* E-mails */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Mail className="h-4 w-4 text-gray-600" />
              <h3 className="font-medium text-gray-700">E-mails</h3>
            </div>
            {colaborador.pessoa.EmailPessoa && colaborador.pessoa.EmailPessoa.length > 0 ? (
              <div className="space-y-1">
                {colaborador.pessoa.EmailPessoa.map((email: EmailPessoa) => (
                  <p key={`email-pdf-${email.email}`} className="text-sm">{email.email}</p>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Nenhum e-mail cadastrado</p>
            )}
          </div>
        </div>
      </div>

      {/* Informações do Contrato */}
      <div>
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          <Building className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Informações do Contrato</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Cargo</p>
            <p className="text-base font-semibold">{cargo.nome}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Data de Admissão</p>
            <p className="text-base">{new Date(admitidoEm).toLocaleDateString('pt-BR')}</p>
          </div>
          {demitidoEm && (
            <div>
              <p className="text-sm font-medium text-gray-600">Data de Demissão</p>
              <p className="text-base">{new Date(demitidoEm).toLocaleDateString('pt-BR')}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Status</p>
            <p className="text-base font-semibold">
              {demitidoEm ? 'Inativo' : 'Ativo'}
            </p>
          </div>
          {contratacao.responsavel && (
            <div>
              <p className="text-sm font-medium text-gray-600">Responsável pela Contratação</p>
              <p className="text-base">{contratacao.responsavel.nome}</p>
            </div>
          )}
        </div>

        {/* Detalhes do Cargo */}
        {(cargo.atribuicoes || cargo.experienciaMinima || cargo.escolaridadeMinima) && (
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Detalhes do Cargo</h3>
            <div className="grid grid-cols-3 gap-4 text-sm mb-4">
              {cargo.experienciaMinima && (
                <div>
                  <p className="font-medium text-gray-600">Experiência Mínima</p>
                  <p>{cargo.experienciaMinima}</p>
                </div>
              )}
              {cargo.escolaridadeMinima && (
                <div>
                  <p className="font-medium text-gray-600">Escolaridade Mínima</p>
                  <p>{cargo.escolaridadeMinima}</p>
                </div>
              )}
              {cargo.superior && (
                <div>
                  <p className="font-medium text-gray-600">Cargo Superior</p>
                  <p>{cargo.superior}</p>
                </div>
              )}
            </div>
            {cargo.atribuicoes && (
              <div>
                <p className="font-medium text-gray-600 mb-2">Atribuições</p>
                <p className="text-sm leading-relaxed">{cargo.atribuicoes}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Treinamentos */}
      {treinamentosRealizados && treinamentosRealizados.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
            <GraduationCap className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Treinamentos</h2>
          </div>
          
          <div className="space-y-4">
            {treinamentosRealizados.map((treinamento) => (
              <div key={`treinamento-pdf-${treinamento.id}`} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium text-gray-700">{treinamento.treinamento.nome}</p>
                    <p className="text-sm text-gray-600 capitalize">
                      Tipo: {treinamento.treinamento.tipo}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Iniciado em: {format(new Date(treinamento.iniciadoEm), 'dd/MM/yyyy', { locale: ptBR })}
                    </p>
                    {treinamento.finalizadoEm && (
                      <p className="text-sm text-gray-600">
                        Finalizado em: {format(new Date(treinamento.finalizadoEm), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    )}
                    {!treinamento.finalizadoEm && (
                      <p className="text-sm text-yellow-600 font-medium">Em andamento</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Histórico */}
      {historicoContratacao && historicoContratacao.length > 0 && (
        <div>
          <div className="flex flex-row justify-normal items-center gap-2 mb-4 border-b border-gray-200 pb-2">
            <Clock className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-800">Histórico do Contrato</h2>
          </div>
          
          <div className="space-y-3">
            {historicoContratacao.map((item) => (
              <div key={`historico-pdf-${item.id}`} className="border-l-4 border-gray-300 pl-4 py-2">
                <div className="flex flex-col items-start align-middle">
                  <p className="font-medium text-gray-700">{item.descricao}</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(item.data), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>

      {/* Rodapé */}
      <div className="mt-12 pt-6 border-t border-gray-300 text-center text-sm text-gray-500">
        <p>Relatório gerado automaticamente pelo sistema ERP Alliance</p>
        <p>Data de geração: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
      </div>
    </div>
  )
}
