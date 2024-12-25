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

export function AddRooom({ fetchBranches, branchId }) {
  const [open, setOpen] = useState(false);
  const [newRoomName, setnewRoomName] = useState("");
  const [loading, setLoading] = useState(false);

  // Xona qo'shish
  const handleAddRoom = async () => {
    if (!newRoomName.trim()) return toast.error("Iltimos, xona nomini kiriting.");
    setLoading(true);
    const roomId = newRoomName.trim().toLowerCase().replace(/\s+/g, "-");
    try {
      const roomRef = doc(db, `branches/${branchId}/rooms`, roomId);
      await setDoc(roomRef, {
        name: newRoomName.trim(),
        branchId,
      });
      setnewRoomName("");
      fetchBranches();
    } catch (error) {
      console.error("Xona qo'shishda xatolik:", error);
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
              value={newRoomName}
              onChange={(e) => setnewRoomName(e.target.value)}
              placeholder="Nomi kiriting"
            />
          </div>
          <DialogFooter>
            <Button
              disabled={loading || !newRoomName.trim()}
              onClick={handleAddRoom}
            >
              {loading ? <div className="addItemLoader"></div> : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
