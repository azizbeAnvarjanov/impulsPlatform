"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const departmentsRef = collection(db, "departments");

  // Bo'limlarni yuklash
  const fetchDepartments = async () => {
    const data = await getDocs(departmentsRef);
    setDepartments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Yangi bo'lim qo'shish
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (departmentName.trim() === "") return;

    try {
      await addDoc(departmentsRef, { name: departmentName });
      setDepartmentName("");
      fetchDepartments(); // Ro'yxatni yangilash
    } catch (error) {
      console.error("Bo'lim qo'shishda xatolik:", error);
    }
  };

  // Bo'limni o'chirish
  const handleDeleteDepartment = async (id) => {
    try {
      await deleteDoc(doc(db, "departments", id));
      fetchDepartments(); // Ro'yxatni yangilash
    } catch (error) {
      console.error("Bo'lim o'chirishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  if (departments.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Bo'limlar</h1>

        {/* Yangi bo'lim qo'shish */}
        <form
          onSubmit={handleAddDepartment}
          className="mb-4 flex gap-4 items-center"
        >
          <input
            type="text"
            placeholder="Bo'lim nomi"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
            className="border p-2 rounded-md w-1/3"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Qo'shish
          </button>
        </form>
        <div>
          Bo'limlar yo'q
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bo'limlar</h1>

      {/* Yangi bo'lim qo'shish */}
      <form
        onSubmit={handleAddDepartment}
        className="mb-4 flex gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Bo'lim nomi"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          className="border p-2 rounded-md w-1/3"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Qo'shish
        </button>
      </form>

      {/* Bo'limlar ro'yxati */}
      <div>
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md mb-2"
          >
            <Link href={`/admin/departments/${dept.id}`}>{dept.name}</Link>
            <button
              onClick={() => handleDeleteDepartment(dept.id)}
              className="text-red-500"
            >
              O'chirish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Departments;
