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

export function Additem({ path, fetching }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // Filial qo'shish funksiyasi
  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name.trim()) {
      setLoading(false);
      toast.error("Iltimos, filial nomini kiriting.");
      return;
    }

    const itemId = name.trim().toLowerCase().replace(/\s+/g, "-");

    try {
      // Item qo'shish
      await setDoc(doc(db, path, itemId), {
        name: name.trim(),
      });

      setName("");
      fetching();
      toast.success("Item muvaffaqiyatli qo'shildi!");
      setOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Item qo'shishda xatolik:", error);
      toast.error("Item qo'shishda xatolik yuz berdi.");
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
              onClick={(e) => handleAddItem(e)}
            >
              {loading ? <div className="addItemLoader"></div> : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
