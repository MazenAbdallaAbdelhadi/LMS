import { getAnalytics } from "@/actions/get-analytics";
import { currentUser } from "@/lib/auth";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

const AnalyticsPage = async () => {
  const user = await currentUser();

  const { data, totalRevenue, totalSales } = await getAnalytics(user?.id!);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <DataCard label="Total Revenue" value={totalRevenue} shouldFormat />
        <DataCard label="Total Sales" value={totalSales} />
      </div>

      <Chart data={data} />
    </div>
  );
};

export default AnalyticsPage;
