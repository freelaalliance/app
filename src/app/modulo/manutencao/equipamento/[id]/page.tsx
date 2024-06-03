import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"

export default function EquipamentoManutencao(){
  const EquipamentoView = dynamic(() => import('../views/EquipamentosView'), {
    loading: () => <Loader2 className="size-10 animate-spin" />,
    ssr: false,
  })

  return (
    <div className="flex flex-row justify-center">
      <EquipamentoView/>
    </div>
  )
}