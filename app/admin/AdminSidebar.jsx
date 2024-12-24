"use client";
import { signOut } from "firebase/auth";
import Link from "next/link";
import React from "react";
import { auth } from "../firebase";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";

const AdminSidebar = () => {
  const user = auth.currentUser;
  const handleLogout = async () => {
    try {
      await signOut(auth); // Foydalanuvchini tizimdan chiqarish
      alert("Tizimdan muvaffaqiyatli chiqildi!");
      // Foydalanuvchini login sahifasiga yo'naltirish
      window.location.href = "/login";
    } catch (error) {
      console.error("Logoutda xatolik yuz berdi:", error);
      alert("Logoutda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    }
  };
  return (
    <div>
      <div className="border border-r-2 fixed left-0 top-0 h-screen w-[35vh] p-5">
        <Link
          href="/admin"
          className="p-3 hover:bg-muted rounded-md w-full flex font-bold"
        >
          Main page
        </Link>
        <ul className="mt-4">
          <li className="p-3 hover:bg-muted rounded-md">
            <Link href="/admin/departments">
              <h1 className="font-bold">Bo'limlar</h1>
            </Link>
          </li>
          <li className="p-3 hover:bg-muted rounded-md">
            <Link href="/admin/users">
              <h1 className="font-bold">Foydalanuvchilar</h1>
            </Link>
          </li>
          <li className="p-3 hover:bg-muted rounded-md">
            <Link href="/admin/branches">
              <h1 className="font-bold">Filiallar</h1>
            </Link>
          </li>
          <li className="p-3 hover:bg-muted rounded-md">
            <Link href="/admin/all-equipments">
              <h1 className="font-bold">Barcha jihozlar</h1>
            </Link>
          </li>
          <Button
            className="w-[90%] left-[50%] absolute bottom-5 -translate-x-[50%]"
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>{" "}
          <br />
          {/* {user ? <>{user.uid}</>:<>n</>} */}
        </ul>
      </div>
    </div>
  );
};

export default AdminSidebar;
