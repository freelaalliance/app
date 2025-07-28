'use client'

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { FormularioCriarTreinamento } from "../../_components/forms/treinamentos/FormularioCriarTreinamento";
import { colunasTabelaTreinamentos } from "../../_components/tabelas/treinamentos/colunas-tabela-treinamentos";
import { TabelaTreinamentos } from "../../_components/tabelas/treinamentos/tabela";
import { useTreinamentos } from "../../_hooks/treinamentos/useTreinamentos";

export default function TreinamentosPage(){
  const { data: dadosTreinamentos, isFetching: carregandoTreinamentos } = useTreinamentos()

  return (
    <section className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Treinamentos</CardTitle>
              <CardDescription>Painel de gestão de treinamentos de capacitação e integração</CardDescription>
            </div>
            <FormularioCriarTreinamento>
              <Button className="flex items-center gap-2 bg-padrao-red hover:bg-red-800">
                <Plus className="h-4 w-4" />
                Novo Treinamento
              </Button>
            </FormularioCriarTreinamento>
          </div>
        </CardHeader>
        <CardContent>
          <TabelaTreinamentos
            listaTreinamentos={dadosTreinamentos}
            carregandoTreinamentos={carregandoTreinamentos}
            colunasTabela={colunasTabelaTreinamentos}
          />
        </CardContent>
      </Card>
    </section>
  )
}