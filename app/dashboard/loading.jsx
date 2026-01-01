export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-muted animate-pulse rounded-lg h-64"></div>
          </div>
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="bg-muted animate-pulse rounded-lg h-12"></div>
              <div className="bg-muted animate-pulse rounded-lg h-96"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
