import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardCardProps {
  icon: React.ReactNode
  title: string
  value: string | number | null
  loading?: boolean
}

export function DashboardCard({ icon, title, value, loading }: DashboardCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-6 w-3/4 mt-2" />
        ) : (
          <div className="text-2xl font-semibold text-padrao-gray-900">{value}</div>
        )}
      </CardContent>
    </Card>
  )
}