import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

const EquipamentoView = dynamic(() => import('../views/EquipamentosView'), {
  loading: () => {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="size-10 animate-spin" />
      </div>
    )
  },
  ssr: false,
})

export default function EquipamentoManutencao(){
  return <EquipamentoView/>
}