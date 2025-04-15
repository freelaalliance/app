import { Skeleton } from '@/components/ui/skeleton'

import { Card, CardContent } from '../ui/card'

export function LoadingCard() {
  return (
    <Card className="border-0 shadow-md text-muted dark:text-white bg-padrao-gray-100 dark:shadow-none dark:bg-muted w-full">
      <CardContent className="flex flex-col py-3 space-y-4">
        <Skeleton className="h-4 w-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[50px]" />
          <Skeleton className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
