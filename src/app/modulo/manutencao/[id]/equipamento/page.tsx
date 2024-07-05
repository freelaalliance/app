'use client'

import { useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const InspecoesEquipamentoView = dynamic(() => import('../../views/InspecoesEquipamentoView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

const ManutencoesEquipamentoView = dynamic(() => import('../../views/ManutencoesEquipamentoView'), {
  loading: () => {
    return (
      <div className="flex justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: true,
})

export default function PageInspecaoEquipamento() {

  const searchParams = useSearchParams()
  const idEquipamento = searchParams.get('id')
  const nomeEquipamento = searchParams.get('nome')

  return (
    <div className="space-y-2">
      <div className="flex flex-1 shadow rounded-lg bg-zinc-200 p-4 space-x-2 justify-between items-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant={'link'} size={'icon'} onClick={() => {
              history.back()
            }}>
              <ArrowLeft className="size-5 text-black" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Voltar para lista de equipamentos</p>
          </TooltipContent>
        </Tooltip>
        <h1 className="text-xl font-semibold text-black">
          {nomeEquipamento}
        </h1>
      </div>
      <Separator />
      <Tabs defaultValue="inspecoes" className="space-y-4">
        <TabsList className="flex bg-transparent space-x-2 justify-between md:justify-start">
          <TabsTrigger
            className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500"
            value="inspecoes"
          >
            Inspeções
          </TabsTrigger>
          {/* <TabsTrigger
            className="shadow-md bg-sky-400 text-white data-[state=active]:bg-sky-600 data-[state=active]:text-white hover:bg-sky-500"
            value="manutencoes"
          >
            Manutenções
          </TabsTrigger> */}
        </TabsList>
        <TabsContent className="space-y-4" value="inspecoes">
          <InspecoesEquipamentoView idEquipamento={idEquipamento ?? ''}/>
        </TabsContent>
        <TabsContent className="space-y-4" value="manutencoes">
          <ManutencoesEquipamentoView idEquipamento={idEquipamento ?? ''}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}