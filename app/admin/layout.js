import { getAuth } from "firebase/auth";
import Link from "next/link";
import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div>
      <AdminSidebar />
      <div className="pl-[35vh]">{children}</div>
    </div>
  );
};

export default AdminLayout;
