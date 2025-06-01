import EcommerceMetrics from "./components/EcommerceMetrics";
import PageMeta from "../../components/common/PageMeta";
import MyElections from "./components/MyElections";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useEffect, useState } from "react";

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5174/api/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        console.log("API Response:", data);
        setUser(data);
        console.log("User state after update:", user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <>
      <PageMeta
        title="Castify - Online Voting Platform"
        description="Castify - A secure and efficient online voting platform"
      />
      <PageBreadcrumb pageTitle="Dashboard" />

      <div>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white/90 mb-6">
          Hey {user?.firstName || "User"} &#128075;
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
