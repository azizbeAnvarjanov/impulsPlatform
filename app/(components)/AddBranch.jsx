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
import { doc, setDoc } from "firebase/firestore";
import { CircleFadingPlus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { db } from "../firebase";

export function AddBranch({ fetchBranches }) {
  const [open, setOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [loading, setLoading] = useState(false);

  // Filial qo'shish funksiyasi
  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim()) {
      toast.error("Iltimos, filial nomini kiriting.");
      return;
    }

    const branchId = newBranchName.trim().toLowerCase().replace(/\s+/g, "-");
    setLoading(true);

    try {
      // Filialni qo'shish
      await setDoc(doc(db, "branches", branchId), {
        name: newBranchName.trim(),
      });

      fetchBranches();
      setNewBranchName("");
      toast.success("Filial muvaffaqiyatli qo'shildi!");
      setOpen(false);
    } catch (error) {
      console.error("Filial qo'shishda xatolik:", error);
      toast.error("Filial qo'shishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
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
            <DialogTitle>
              Filial nomini kiriting
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              placeholder="Nomi kiriting"
            />
          </div>
          <DialogFooter>
            <Button
              disabled={loading || !newBranchName.trim()}
              onClick={(e) => handleAddBranch(e)}
            >
              {loading ? <div className="addItemLoader"></div> : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
