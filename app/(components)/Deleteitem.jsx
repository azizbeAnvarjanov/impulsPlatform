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

export const Deleteitem = ({ path, itemId, fetching }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ref = doc(db, path, itemId);
    setLoading(true);
    try {
      await deleteDoc(ref);
      fetching();
      toast.success("Jihoz muvaffaqiyatli o'chirildi!");
      setOpen(false);
      setLoading(false);
    } catch (error) {
      toast.error("Jihoz o'chirishda xatolik:", error.message);
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
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
