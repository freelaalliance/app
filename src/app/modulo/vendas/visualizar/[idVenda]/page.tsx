'use client';

import { VendaPlaceholder } from "@/app/modulo/vendas/_components/vendas/placeholder/dados-venda-placeholder";
import { useVenda } from "@/app/modulo/vendas/_servicos/useVendas";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AlertCircleIcon, ArrowLeft, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const VisualizarDadosVenda = dynamic(
  () => import('../../_components/vendas/views/visualizar-venda'),
  {
    loading: () => {
      return (
        <div className="flex justify-center">
          <Loader2 className="size-10 animate-spin" />
        </div>
      )
    },
    ssr: true,
  },
)

export default function VisualizarVendaPage() {
  const { idVenda: id } = useParams() as { idVenda: string };
  const { data: venda, isFetching, error } = useVenda(id);

  if (isFetching) {
    return (
      <Card>
        <CardContent className="container py-4">
          <VendaPlaceholder />
        </CardContent>
      </Card>
    )
  }

  if (!venda) {
    return (
      <Alert className="flex flex-row w-full align-middle gap-6">
        <AlertCircleIcon className="size-5" />
        <AlertTitle>Venda não encontrada!</AlertTitle>
      </Alert>
    )
  }

  if (error) {
    return (
      <Alert variant={'destructive'} className="flex flex-row w-full align-middle gap-6">
        <AlertCircleIcon className="size-5" />
        <AlertTitle>Erro ao consultar venda</AlertTitle>
        <AlertDescription>
          {error.message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-2">
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
            <p>Voltar para a tela de venda</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <VisualizarDadosVenda id={id} venda={venda} />
    </div>
  );
}
