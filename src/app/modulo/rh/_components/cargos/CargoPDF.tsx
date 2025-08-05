

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  BriefcaseIcon,
  FileText,
  GraduationCap
} from 'lucide-react'
import type { Cargo } from '../../_types/cargos/CargoType'

interface CargoPDFProps {
  cargo: Cargo
}

export function CargoPDF({ cargo }: CargoPDFProps) {
  return (
    <div className="p-8 bg-white text-black min-h-screen rounded" style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Cabeçalho */}
      <div className="text-center mb-8 border-b-2 border-gray-300 pb-6">
        <h1 className="text-2xl font-bold text-gray-800">Descrição do cargo</h1>
        <p className="text-gray-600 mt-2">Gerado em {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</p>
      </div>

      {/* Informações Básicas */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          <BriefcaseIcon className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Informações Básicas</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-600">Nome do Cargo</p>
            <p className="text-base font-semibold">{cargo.nome}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Exige ensino superior</p>
            <p className="text-base">{cargo.superior ? 'Sim' : 'Não'}</p>
          </div>
        </div>

        {cargo.atribuicoes && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">Atribuições</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{cargo.atribuicoes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Requisitos */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          <GraduationCap className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">Requisitos</h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Experiência Mínima</p>
            <p className="text-base">{cargo.experienciaMinima || 'Não especificado'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Escolaridade Mínima</p>
            <p className="text-base">{cargo.escolaridadeMinima || 'Não especificado'}</p>
          </div>
        </div>
      </div>

      {/* Treinamentos de Integração */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            Treinamentos de Integração
          </h2>
        </div>

        {cargo?.treinamentos?.length === 0 ? (
          <div className="text-center p-6 text-gray-500">
            <p className="text-sm">Nenhum treinamento associado a este cargo</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cargo?.treinamentos?.map((treinamento) => (
              <div
                key={treinamento.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-800">{treinamento.nome}</h4>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {treinamento.tipo}
                  </span>
                </div>
              </div>
            ))}
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
