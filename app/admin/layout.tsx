"use client";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@/context/user-context";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {    
    if (user?.role !== "admin") {
      router.push("/unauthorized"); // Redirect non-admin users
    }
  }, [router, user?.role]);

  return <>{children}</>;
};

export default AdminLayout;
