import { atom, useAtom } from 'jotai'

import {
  FuncaoModuloType,
  ModuloType,
} from '@/app/modulo/administrativo/empresa/schemas/SchemaModulo'
import { empresaType } from '@/app/modulo/administrativo/empresa/schemas/SchemaNovaEmpresa'


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

const configAtomModulos = atom<ConfigModuloType>({
  selected: null,
})

const configAtomFuncoesModulo = atom<ConfigFuncaoModuloType>({
  selected: null,
})

export function useEmpresa() {
  return useAtom(configAtomEmpresas)
}


export function useModulos() {
  return useAtom(configAtomModulos)
}

export function useFuncoesModulo() {
  return useAtom(configAtomFuncoesModulo)
}
