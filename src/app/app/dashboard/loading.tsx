export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="h-10 w-48 bg-slate-800/50 rounded-md animate-pulse"></div>
        <div className="h-8 w-64 bg-slate-800/50 rounded-full animate-pulse"></div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card rounded-xl p-6 h-32 flex flex-col justify-between">
            <div className="h-5 w-2/3 bg-slate-800/50 rounded animate-pulse"></div>
            <div className="h-8 w-1/2 bg-slate-800/50 rounded animate-pulse mt-4"></div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4 glass-card rounded-xl p-6 h-96 flex flex-col">
          <div className="h-6 w-1/3 bg-slate-800/50 rounded animate-pulse mb-8"></div>
          <div className="flex-1 w-full bg-slate-800/20 rounded animate-pulse"></div>
        </div>
        <div className="col-span-3 glass-card rounded-xl p-6 h-96 flex flex-col">
          <div className="h-6 w-1/3 bg-slate-800/50 rounded animate-pulse mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-slate-800/50 rounded-full animate-pulse"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/2 bg-slate-800/50 rounded animate-pulse"></div>
                  <div className="h-3 w-1/3 bg-slate-800/50 rounded animate-pulse"></div>
                </div>
                <div className="h-5 w-16 bg-slate-800/50 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
