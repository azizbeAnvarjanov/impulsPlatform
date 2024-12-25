"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit, PlusCircle, Trash } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddBranch } from "@/app/(components)/AddBranch";
import { DeleteBranch } from "@/app/(components)/DeleteBranch";
import { EditBranchName } from "@/app/(components)/EditBranchName";

const Branches = () => {
  const [branches, setBranches] = useState([]);
  const [newBranch, setNewBranch] = useState({ name: "" });
  const [editingBranch, setEditingBranch] = useState(null); // O'zgartirish uchun
  const [loading, setLoading] = useState(true);

  const branchesRef = collection(db, "branches");

  // Filiallarni olish funksiyasi
  const fetchBranches = async () => {
    const data = await getDocs(branchesRef);
    setBranches(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-5">
        <AddBranch fetchBranches={fetchBranches} />
        <h1 className="text-2xl font-bold">Filiallar</h1>
      </div>

      {/* Filiallar ro'yxati */}
      <div className="grid grid-cols-4 gap-5">
        {branches.map((branch) => (
          <Card
            key={branch.id}
            className="p-5 w-auto flex items-center justify-between"
          >
            {editingBranch === branch.id ? (
              <CardHeader>
                <Input
                  type="text"
                  defaultValue={branch.name}
                  onBlur={(e) => handleEditBranch(branch.id, e.target.value)}
                  className="border p-2 rounded-md flex-1"
                />
              </CardHeader>
            ) : (
              <Link
                href={`/admin/branches/${branch.id}`}
                className="text-2xl font-bold text-center"
              >
                {branch.name}
              </Link>
            )}

            <div className="flex gap-2 items-center justify-center">
              <EditBranchName
                fetchBranches={fetchBranches}
                branchename={branch.name}
                branchId={branch.id}
              />
              <DeleteBranch
                branchId={branch.id}
                fetchBranches={fetchBranches}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Branches;
