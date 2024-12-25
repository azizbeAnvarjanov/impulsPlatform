"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { doc, setDoc } from "firebase/firestore";
import { CircleFadingPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../firebase";

export function AddStorage({ fetchBranches, branchId }) {
  const [open, setOpen] = useState(false);
  const [newStorageName, setnewStorageName] = useState("");
  const [loading, setLoading] = useState(false);

   // Sklad qo'shish
   const handleAddStorage = async () => {
    if (!newStorageName.trim())
      return toast.error("Iltimos, sklad nomini kiriting.");
    setLoading(true);
    const storageId = newStorageName.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      const storageRef = doc(db, `branches/${branchId}/storages`, storageId);
      await setDoc(storageRef, {
        name: newStorageName.trim(),
        branchId,
      });
      setnewStorageName("");
      fetchBranches();
    } catch (error) {
      console.error("Sklad qo'shishda xatolik:", error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CircleFadingPlus />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xona nomini kiriting</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              value={newStorageName}
              onChange={(e) => setnewStorageName(e.target.value)}
              placeholder="Nomi kiriting"
            />
          </div>
          <DialogFooter>
            <Button
              disabled={loading || !newStorageName.trim()}
              onClick={handleAddStorage}
            >
              {loading ? <div className="addItemLoader"></div> : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
