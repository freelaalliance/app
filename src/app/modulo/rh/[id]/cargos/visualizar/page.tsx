'use client'

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowBigDownDash, ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Margin, Resolution, usePDF } from "react-to-pdf";
import { toast } from "sonner";
import { CargoPDF } from "../../../_components/cargos/CargoPDF";
import { useCargo } from "../../../_hooks/cargos/useCargos";

export default function PdfCargoPage() {
  const searchParams = useSearchParams();

  const { data: cargo, isFetching } = useCargo(searchParams.get('id') ?? '')

  const { toPDF, targetRef } = usePDF({
    filename: `cargo-${cargo?.nome.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`,
    resolution: Resolution.HIGH,
    page: {
      margin: Margin.MEDIUM,
      format: 'A4',
      orientation: 'portrait',
    }
  })

  const handleExportPDF = () => {
    if (targetRef.current) {
      toPDF()
      toast.success('PDF exportado com sucesso!')
    }
  }

  return (
    isFetching ? (
      <div className="w-full max-w-4xl mx-auto p-8 space-y-6 bg-white text-black min-h-screen">
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Skeleton className="h-32 w-full" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    ) : (
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row shadow rounded bg-zinc-200 p-4 space-x-2 justify-normal md:justify-between items-center">
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
              <p>Voltar para a tela de cargos</p>
            </TooltipContent>
          </Tooltip>
          <Button
            size={'sm'}
            className="shadow bg-padrao-gray-250 hover:bg-gray-900 gap-2"
            onClick={handleExportPDF}
          >
            <ArrowBigDownDash className="size-5" />
            {'Exportar'}
          </Button>
        </div>
        <div ref={targetRef}>
          <CargoPDF cargo={cargo ?? {
            id: '',
            nome: '',
            atribuicoes: '',
            superior: false,
            experienciaMinima: '',
            escolaridadeMinima: '',
            treinamentos: []
          }} />
        </div>
      </div>

    )

  )
}