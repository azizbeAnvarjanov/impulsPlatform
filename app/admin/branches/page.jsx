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

  // Filial qo'shish funksiyasi
  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranch.name.trim()) {
      toast.error("Iltimos, filial nomini kiriting.");
      return;
    }

    const branchId = newBranch.name.trim().toLowerCase().replace(/\s+/g, "-");
    setLoading(true);

    try {
      // Filialni qo'shish
      await setDoc(doc(db, "branches", branchId), {
        name: newBranch.name.trim(),
      });

      fetchBranches();
      setNewBranch({ name: "" });
      toast.success("Filial muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Filial qo'shishda xatolik:", error);
      toast.error("Filial qo'shishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Filial nomini o'zgartirish funksiyasi
  const handleEditBranch = async (id, name) => {
    if (!name.trim()) {
      toast.error("Iltimos, yangi filial nomini kiriting.");
      return;
    }

    setLoading(true);

    try {
      await updateDoc(doc(db, "branches", id), { name: name.trim() });
      fetchBranches();
      setEditingBranch(null);
      toast.success("Filial muvaffaqiyatli o'zgartirildi!");
    } catch (error) {
      console.error("Filialni o'zgartirishda xatolik:", error);
      toast.error("Filialni o'zgartirishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  // Filialni o'chirish funksiyasi
  const handleDeleteBranch = async (id) => {
    const confirmDelete = confirm(
      "Filialni va barcha ma'lumotlarini o'chirishni tasdiqlaysizmi?"
    );
    if (!confirmDelete) return;

    setLoading(true);

    try {
      // Filialni o'chirish
      await deleteDoc(doc(db, "branches", id));
      fetchBranches();
      toast.success("Filial muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("Filialni o'chirishda xatolik:", error);
      toast.error("Filialni o'chirishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  // if (loading) {
  //   return <>loading...</>;
  // }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Filiallar</h1>

      {/* Filial qo'shish formasi */}
      <form onSubmit={handleAddBranch} className="mb-4 flex gap-4">
        <Input
          type="text"
          placeholder="Filial nomini kiriting"
          value={newBranch.name}
          onChange={(e) => setNewBranch({ name: e.target.value })}
          className="border p-2 rounded-md flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "..." : <PlusCircle />}
        </Button>
      </form>

      {/* Filiallar ro'yxati */}
      <div className="grid grid-cols-4 gap-5">
        {branches.map((branch) => (
          <Card key={branch.id} className="p-5 w-auto flex items-center justify-between">
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
              <Button onClick={() => setEditingBranch(branch.id)}>
                <Edit />
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDeleteBranch(branch.id)}
              >
                <Trash />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Branches;
