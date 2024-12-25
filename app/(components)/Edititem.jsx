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

export function EditItem({ path, itemId, fetching, itemName }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(itemName);
  const [loading, setLoading] = useState(false);

  // Filial qo'shish funksiyasi
  const handleEditNameItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name.trim()) {
      setLoading(false);
      toast.error("Iltimos, yangi item nomini kiriting.");
      return;
    }

    try {
      await updateDoc(doc(db, path, itemId), { name: name.trim() });
      fetching();
      toast.success("Item muvaffaqiyatli o'zgartirildi!");
    } catch (error) {
      console.error("Item o'zgartirishda xatolik:", error);
      toast.error("Item o'zgartirishda xatolik yuz berdi.");
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
            <DialogTitle>
              {path === "equipmentTypes"
                ? "Jihoz turlari"
                : path === "equipmentStatus"
                ? "Jihoz statuslari"
                : "Jihoz o'lchov birliklari"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nomi kiriting"
            />
          </div>
          <DialogFooter>
            <Button
              disabled={loading || !name.trim()}
              onClick={(e) => handleEditNameItem(e)}
            >
              {loading ? <div className="addItemLoader"></div> : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
