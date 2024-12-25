"use clientw";
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
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { CircleFadingPlus, Edit } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../firebase";

export function EditBranchName({ branchId, branchename, fetchBranches }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(branchename);
  const [loading, setLoading] = useState(false);

  // Filial nomini o'zgartirish funksiyasi
  const handleEditBranch = async () => {
    setLoading(true);

    try {
      await updateDoc(doc(db, "branches", branchId), { name: name.trim() });
      fetchBranches();
      toast.success("Filial muvaffaqiyatli o'zgartirildi!");
    } catch (error) {
      console.error("Filialni o'zgartirishda xatolik:", error);
      toast.error("Filialni o'zgartirishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Edit />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filial nomini o'zgartirish</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nomi kiriting"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleEditBranch}>
              {loading ? <div className="addItemLoader"></div> : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
