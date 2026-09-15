import { Building } from 'reicon-react'

export default function Page() {
  return (
    <div>
      <h1 className="font-black text-xl">مشتریان</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <div className="flex items-center gap-2 rounded-md border p-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Building className="size-6" />
          </div>
          <div className="grid flex-1 gap-1">
            <p className="font-medium text-sm">شرکت صنایع ارتباط غدیر</p>
            <p className="text-muted-foreground text-xs">09199973120</p>
          </div>
        </div>
      </div>
    </div>
  )
}
