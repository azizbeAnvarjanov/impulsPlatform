"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { doc, collection, getDocs, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/app/firebase";
import { DoorOpen } from "lucide-react";
import toast from "react-hot-toast";

const MoveRoomModal = ({ branchId, roomId, equipment,path }) => {
  const [open, setOpen] = useState(false);
  const [rooms, setRooms] = useState([]); // Faqat xonalar ro'yxati
  const [selectedRoom, setSelectedRoom] = useState(""); // Tanlangan xona

  useEffect(() => {
    // Xonalar ro'yxatini olish
    const fetchRooms = async () => {
      const roomsCollection = collection(doc(db, "branches", branchId), path);
      const roomsSnapshot = await getDocs(roomsCollection);
      const roomsList = roomsSnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setRooms(roomsList);
    };

    fetchRooms();
  }, [branchId]);

  const handleMoveEquipment = async () => {
    if (!selectedRoom) {
      return toast.error("Joylashuvni tanlang!");
    }

    try {
      const sourceRef = doc(
        db,
        "branches",
        branchId,
        path,
        roomId,
        "equipment",
        equipment.id
      );

      const destinationRef = doc(
        db,
        "branches",
        branchId,
        path,
        selectedRoom,
        "equipment",
        equipment.id
      );

      // Eski ma'lumotni olish va yangi joyga yozish
      const equipmentData = { ...equipment };
      delete equipmentData.id; // ID qayta yozilmasligi uchun olib tashlanadi

      await setDoc(destinationRef, equipmentData); // Yangi joyga yozish
      await deleteDoc(sourceRef); // Eski joydan o'chirish

      toast.success("Jihoz muvaffaqiyatli ko‘chirildi!");
      setOpen(false);
    } catch (error) {
      console.error("Jihozni ko'chirishda xato:", error);
      toast.error("Jihozni ko'chirishda xatolik yuz berdi.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <DoorOpen size="250px" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Jihozni boshqa xonaga ko‘chirish</DialogTitle>
        <div className="my-4">
          <Select onValueChange={setSelectedRoom}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Joylashuvni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {rooms.map((room) => (
                <SelectItem key={room.id} value={room.id}>
                  {room.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Bekor qilish
          </Button>
          <Button onClick={handleMoveEquipment}>Ko‘chirish</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MoveRoomModal;
