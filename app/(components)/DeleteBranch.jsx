"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/app/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";

export const DeleteBranch = ({ branchId, fetchBranches }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filialni o'chirish funksiyasi
  const handleDeleteBranch = async () => {
    setLoading(true);

    try {
      // Filialni o'chirish
      await deleteDoc(doc(db, "branches", branchId));
      fetchBranches();
      toast.success("Filial muvaffaqiyatli o'chirildi!");
    } catch (error) {
      console.error("Filialni o'chirishda xatolik:", error);
      toast.error("Filialni o'chirishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
      setOpen(false);
      fetchBranches();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rostan ham o'chirmoqchimiz !</AlertDialogTitle>
          <AlertDialogDescription>
            Agar binoni o'chirsangiz ichidagi barcha jihozlar ham o'chib ketadi
            tiklab bo'lmaydi !
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDeleteBranch}
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
