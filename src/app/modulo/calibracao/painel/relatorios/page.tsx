'use client'

import { Card, CardContent, CardTitle } from '@/components/ui/card'

import { FormularioRelatorio } from './components/FormularioRelatorio'

export default function Relatorios() {
  return (
    <Card className="shadow bg-gray-50">
      <CardTitle className="py-4 ml-3">Relatório de calibrações</CardTitle>
      <CardContent className="flex flex-col md:flex-row justify-between gap-2">
        <FormularioRelatorio />
      </CardContent>
    </Card>
  )
}
