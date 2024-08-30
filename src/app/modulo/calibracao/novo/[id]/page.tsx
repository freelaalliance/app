import { Metadata } from 'next'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

import { NovaCalibracaoForm } from '../components/form/FormularioNovaCalibracao'

export const metadata: Metadata = {
  title: 'ERP | Nova Calibração',
  description: 'Tela para inserir novas calibrações no módulo',
}

export default function Novo() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Nova Calibração</h3>
      </div>
      <Separator />
      <Card className="shadow bg-gray-50">
        <CardContent className="py-4">
          <NovaCalibracaoForm />
        </CardContent>
      </Card>
    </div>
  )
}
