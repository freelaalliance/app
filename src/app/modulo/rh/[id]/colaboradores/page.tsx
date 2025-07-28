'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { FileText } from 'lucide-react'
import { useState } from 'react'
import { FormularioNovaContratacao } from '../../_components/forms/contratacao/FormularioNovaContratacao'
import { colunasColaboradores } from '../../_components/tabelas/colaboradores/colunas-tabela-colaboradores'
import { TabelaColaboradores } from '../../_components/tabelas/colaboradores/tabela'
import { useContratacoes } from '../../_hooks/colaborador/useContratacaoColaborador'

export default function ColaboradoresPage() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const { data: contratacoes, isFetching: carregandoContratacoes } = useContratacoes()

  const handleContratacaoSalva = () => {
    setDialogOpen(false)
  }

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                Contratos de Colaboradores
              </CardTitle>
              <CardDescription>
                Gerencie os contratos de colaboradores
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-padrao-red hover:bg-red-800">
                  <FileText className="h-4 w-4 mr-2" />
                  Nova Contratação
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Nova Contratação</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do colaborador para realizar uma nova contratação.
                  </DialogDescription>
                </DialogHeader>
                
                <FormularioNovaContratacao onSubmitCallback={handleContratacaoSalva} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <TabelaColaboradores
            listaColaboradores={contratacoes || []}
            carregandoColaboradores={carregandoContratacoes}
            colunasTabela={colunasColaboradores}
          />
        </CardContent>
      </Card>
    </section>
  )
}
