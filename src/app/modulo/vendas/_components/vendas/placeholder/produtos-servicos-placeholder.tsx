import { Card, CardContent } from "@/components/ui/card";

export function ProdutosServicosPlaceholder() {
  return (
    <Card className="animate-pulse w-full">
      <CardContent className="p-4">
        <div className="h-6 bg-gray-200 rounded mb-2" />
        <div className="h-4 bg-gray-200 rounded mb-4 w-3/4" />
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-24" />
          <div className="h-9 bg-gray-200 rounded w-20" />
        </div>
      </CardContent>
    </Card>
  )
}