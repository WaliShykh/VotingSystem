import EcommerceMetrics from "./components/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import MyElections from "./components/MyElections";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Castify - Online Voting Platform"
        description="Castify - A secure and efficient online voting platform"
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Hey Wali &#128075;
        </h2>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          <EcommerceMetrics />
        </div>
        <MyElections />
        {/* <ElectionResults /> */}
      </div>
    </>
  );
}
