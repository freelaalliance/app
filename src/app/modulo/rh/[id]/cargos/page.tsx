'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FormularioCriarCargo } from "../../_components/forms/cargos/FormularioCriarCargo";
import { colunasTabelaCargos } from "../../_components/tabelas/cargos/colunas-tabela-cargos";
import { TabelaCargos } from "../../_components/tabelas/cargos/tabela";
import { useCargos } from "../../_hooks/cargos/useCargos";

export default function CargosPage(){
  const { data: dadosCargos, isFetching: carregandoCargos } = useCargos()

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle>Cargos</CardTitle>
              <CardDescription>Painel de gestão de cargos e suas atribuições</CardDescription>
            </div>
            <FormularioCriarCargo>
              <Button className="flex items-center gap-2 bg-padrao-red hover:bg-red-800">
                <Plus className="h-4 w-4" />
                Novo Cargo
              </Button>
            </FormularioCriarCargo>
          </div>
        </CardHeader>
        <CardContent>
          <TabelaCargos
            listaCargos={dadosCargos}
            carregandoCargos={carregandoCargos}
            colunas={colunasTabelaCargos}
          />
        </CardContent>
      </Card>
    </section>
  )
}
