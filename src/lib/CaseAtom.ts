import { atom, useAtom } from 'jotai'

import {
  FuncaoModuloType,
  ModuloType,
} from '@/app/modulo/administrativo/empresa/schemas/SchemaModulo'
import { empresaType } from '@/app/modulo/administrativo/empresa/schemas/SchemaNovaEmpresa'
import {
  HistoricoCalibracoesInstrumentoType,
  HistoricoInstrumentoType,
} from '@/app/modulo/calibracao/painel/components/historico_instrumento/api/HistoricoInstrumento'

type ConfigHistoricoCalibracoesType = {
  selected: HistoricoCalibracoesInstrumentoType['id'] | null
}

type ConfigHistoricoInstrumentoType = {
  selected: HistoricoInstrumentoType['id'] | null
}

type ConfigEmpresasType = {
  selected: empresaType['id'] | null
}

type ConfigModuloType = {
  selected: ModuloType['id'] | null
}

type ConfigFuncaoModuloType = {
  selected: FuncaoModuloType['id'] | null
}

const configAtomEmpresas = atom<ConfigEmpresasType>({
  selected: null,
})

const configAtomHistoricoCalibracoes = atom<ConfigHistoricoCalibracoesType>({
  selected: null,
})

const configAtomCalibracaoInstrumento = atom<ConfigHistoricoInstrumentoType>({
  selected: null,
})

const configAtomModulos = atom<ConfigModuloType>({
  selected: null,
})

const configAtomFuncoesModulo = atom<ConfigFuncaoModuloType>({
  selected: null,
})

export function useCalibracao() {
  return useAtom(configAtomHistoricoCalibracoes)
}

export function useEmpresa() {
  return useAtom(configAtomEmpresas)
}

export function useInstrumento() {
  return useAtom(configAtomCalibracaoInstrumento)
}

export function useModulos() {
  return useAtom(configAtomModulos)
}

export function useFuncoesModulo() {
  return useAtom(configAtomFuncoesModulo)
}
