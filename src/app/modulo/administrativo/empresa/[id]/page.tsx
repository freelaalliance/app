'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useEmpresa } from '@/lib/CaseAtom'

import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useQuery } from '@tanstack/react-query'
import { listarEmpresas } from '../api/Empresa'
import { ExcluirEmpresa } from '../components/dialogs/DeletarEmpresaDialog'
import { DialogEdicaoEmpresa } from '../components/dialogs/EditarEmpresaDialog'
import { DialogNovaEmpresa } from '../components/dialogs/NovaEmpresaDialog'
import { ListaEmpresas } from '../components/selects/ListaEmpresas'

export interface EmpresaViewProps {
  idEmpresa: string
}

export default function PageEmpresas() {

  const { data: dadosEmpresas, isFetching: carregandoDados } = useQuery({
    queryKey: ['empresas'],
    queryFn: listarEmpresas,
    initialData: [],
  })

  const [empresaSelecionada] = useEmpresa()

  const ViewPerfil = dynamic(() => import('../(views)/PerfisEmpresaView'), {
    loading: () => <Loader2 className="text-center animate-spin h-6 w-6" />,
  })

  const ViewModulos = dynamic(() => import('../(views)/ModulosEmpresaView'), {
    loading: () => <Loader2 className="text-center animate-spin h-6 w-6" />,
  })

  const ViewUsuarios = dynamic(() => import('../(views)/UsuariosEmpresaView'), {
    loading: () => <Loader2 className="text-center animate-spin h-6 w-6" />,
  })

  return (
    <div className="space-y-4">
      <section className="shadow-lg rounded-lg p-4 bg-zinc-200 space-y-2">
        <div className="flex flex-col md:flex-row md:justify-start gap-2">
          <ListaEmpresas listaEmpresas={dadosEmpresas} carregandoDados={carregandoDados} />
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="shadow-md bg-sky-500 hover:bg-sky-600">
                {'Nova empresa'}
              </Button>
            </DialogTrigger>
            <DialogNovaEmpresa />
          </Dialog>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={!empresaSelecionada.selected} className="shadow-md bg-sky-500 hover:bg-sky-600">
                {'Editar empresa'}
              </Button>
            </DialogTrigger>
            <DialogEdicaoEmpresa
              dadosEmpresa={dadosEmpresas.find(
                empresa => empresa.id === empresaSelecionada.selected
              )}
            />
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button disabled={!empresaSelecionada.selected} className="shadow-md bg-red-500 hover:bg-red-600">
                {'Remover empresa'}
              </Button>
            </AlertDialogTrigger>
            <ExcluirEmpresa empresaId={empresaSelecionada.selected ?? ''}/>
          </AlertDialog>
        </div>
      </section>
      {empresaSelecionada.selected ? (
        <Tabs defaultValue="modulos" className="space-y-4">
          <TabsList className="flex flex-row bg-transparent space-x-2 justify-between md:justify-start">
            <TabsTrigger
              className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 w-full"
              value="modulos"
            >
              Módulos
            </TabsTrigger>
            <TabsTrigger
              className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500 w-full"
              value="perfis"
            >
              Perfis
            </TabsTrigger>
            <TabsTrigger
              className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600  data-[state=active]:text-white hover:bg-sky-500 w-full"
              value="usuarios"
            >
              Usuários
            </TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="modulos">
            <ViewModulos idEmpresa={empresaSelecionada.selected} />
          </TabsContent>
          <TabsContent value="perfis" className="flex-1 w-full">
            <ViewPerfil idEmpresa={empresaSelecionada.selected} />
          </TabsContent>
          <TabsContent value="usuarios">
            <ViewUsuarios idEmpresa={empresaSelecionada.selected} />
          </TabsContent>
        </Tabs>
      ) : (
        <Alert className="shadow border-amber-600 bg-amber-100">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>
            {
              'Para ver as informações e configurações de uma empresa, precisa selecioná-la no campo abaixo!'
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
