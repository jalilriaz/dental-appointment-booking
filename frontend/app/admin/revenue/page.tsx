import RevenueClient from "@/components/admin/RevenueClient"
import { getRevenueData } from "@/app/actions/revenue"

export default async function AdminRevenuePage() {
  // Fetch initial data (defaulting to last 6 months to match the client state)
  const initialData = await getRevenueData("last6Months")

  return (
    <RevenueClient initialData={initialData} />
  )
}
