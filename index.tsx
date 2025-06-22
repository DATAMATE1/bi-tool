import Reports from "@/components/Reports"

export default function Home() {
  const data = {
    sales: [
      { month: "Jan", revenue: 12000, orders: 150, customers: 80 },
      { month: "Feb", revenue: 15000, orders: 180, customers: 90 },
      { month: "Mar", revenue: 17000, orders: 200, customers: 100 },
    ]
  }

  const insights = []

  return (
    <main className="container mx-auto py-10">
      <Reports data={data} insights={insights} />
    </main>
  )
}
