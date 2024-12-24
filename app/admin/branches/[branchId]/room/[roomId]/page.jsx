"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import { AddEquipment } from "@/app/(components)/AddEquipment";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit, ExpandIcon } from "lucide-react";
import EqupmentTableMain from "@/app/(components)/EqupmentTableMain";

const StoragePage = () => {
  const { branchId, roomId } = useParams();
  const [equipment, setEquipment] = useState([]);
  const [roomName, setRoomName] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Jihozlarni yuklash
  useEffect(() => {
    const fetchEquipment = async () => {
      const querySnapshot = await getDocs(
        collection(db, `branches/${branchId}/rooms/${roomId}/equipment`)
      );
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipment(data);
    };

    fetchEquipment();

    const getRoomName = async () => {
      try {
        // Bazadan kerakli hujjatni olish
        const roomDocRef = doc(db, "branches", branchId, "rooms", roomId);
        const roomDoc = await getDoc(roomDocRef);

        if (roomDoc.exists()) {
          // Xonaning nomi hujjatdan olinadi
          const roomName = roomDoc.data();
          setRoomName(roomName.name);
        }
      } catch (error) {
        console.error("Xona nomini olishda xatolik:", error);
        return "Xatolik yuz berdi";
      }
    };

    getRoomName();
  }, [roomId]);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">{roomName}</h1>
      <AddEquipment
        setEquipment={setEquipment}
        branchId={branchId}
        id={roomId}
        path="rooms"
        pathName={roomName}
      />
      <EqupmentTableMain
        equipment={equipment}
        branchId={branchId}
        id={roomId}
        path="rooms"
      />
    </div>
  );
};

export default StoragePage;
