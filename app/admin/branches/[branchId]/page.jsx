"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/app/firebase";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Database,
  Delete,
  Edit,
  EllipsisVertical,
  Eye,
  PlusCircle,
  Trash,
} from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddRooom } from "@/app/(components)/AddRoom";
import { AddStorage } from "@/app/(components)/AddStorage";

const BranchIdPage = () => {
  const params = useParams();
  const branchId = params.branchId;

  const [branch, setBranch] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [storages, setStorages] = useState([]);
  const [newRoom, setNewRoom] = useState("");
  const [newStorage, setNewStorage] = useState("");
  const [searchRoom, setSearchRoom] = useState("");
  const [searchStorage, setSearchStorage] = useState("");
  const [loading, setLoading] = useState(false);

  // Filialni olish
  const fetchBranch = async () => {
    const branchDoc = await getDoc(doc(db, "branches", branchId));
    if (branchDoc.exists()) {
      setBranch(branchDoc.data());
    }
  };

  // Xonalar va skladlarni olish
  const fetchRoomsAndStorages = async () => {
    const roomsData = await getDocs(
      query(collection(db, `branches/${branchId}/rooms`))
    );
    const storagesData = await getDocs(
      query(collection(db, `branches/${branchId}/storages`))
    );

    setRooms(roomsData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setStorages(
      storagesData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  // Xona yoki skladni tahrirlash
  const handleEdit = async (type, id, newName) => {
    if (!newName?.trim()) return toast.error("Nomni kiriting.");
    setLoading(true);

    try {
      await updateDoc(doc(db, `branches/${branchId}/${type}`, id), {
        name: newName.trim(),
      });
      fetchRoomsAndStorages();
    } catch (error) {
      console.error(`${type} tahrirlanmadi:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Xona yoki skladni o'chirish
  const handleDelete = async (type, id) => {
    const confirmDelete = confirm("O'chirishni tasdiqlaysizmi?");
    if (!confirmDelete) return;

    setLoading(true);

    try {
      await deleteDoc(doc(db, `branches/${branchId}/${type}`, id));
      fetchRoomsAndStorages();
    } catch (error) {
      console.error(`${type} o'chirilmadi:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranch();
    fetchRoomsAndStorages();
  }, [branchId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {branch?.name || "Yuklanmoqda..."}
      </h1>
      <div className="w-full grid grid-cols-2 gap-5">
        {/* Xonalar */}
        <div>
          <div className="flex gap-2 items-center gap-3 mb-4">
            <AddRooom
              fetchBranches={fetchRoomsAndStorages}
              branchId={branchId}
            />
            <h2 className="text-xl font-semibold">Xonalar</h2>
          <Input
            type="text"
            placeholder="Xona nomi bo'yicha qidirish"
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
            className="border p-2 rounded-md w-full"
            />
            </div>
          <div className="grid grid-cols-2 gap-5">
            {rooms
              .filter((room) =>
                room.name.toLowerCase().includes(searchRoom.toLowerCase())
              )
              .map((room) => (
                <Card key={room?.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <Link
                          href={`/admin/branches/${branchId}/room/${room.id}`}
                          className="text-xl"
                        >
                          {room?.name}
                        </Link>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleEdit(
                              "rooms",
                              room.id,
                              prompt("Yangi nomni kiriting:")
                            )
                          }
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete("rooms", room.id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            {rooms.length === 0 && (
              <p>
                Xonalar yo'q.
                <Database />
              </p>
            )}
          </div>
        </div>

        {/* Skladlar */}
        <div>
          <div className="flex gap-2 items-center gap-3 mb-4">
            <AddStorage
              fetchBranches={fetchRoomsAndStorages}
              branchId={branchId}
            />
            <h2 className="text-xl font-semibold">Skladlar</h2>
          <Input
            type="text"
            placeholder="Sklad nomi bo'yicha qidirish"
            value={searchStorage}
            onChange={(e) => setSearchStorage(e.target.value)}
            className="border p-2 rounded-md w-full"
            />
            </div>
          {/* <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Sklad name"
              value={newStorage}
              onChange={(e) => setNewStorage(e.target.value)}
              className="border p-2 rounded-md mb-2 w-full"
            />
            <Button
              onClick={handleAddStorage}
              className="py-2 px-4 text-white rounded-md mb-4"
            >
              {loading ? "..." : <PlusCircle />}
            </Button>
          </div> */}
          <div className="grid grid-cols-2 gap-5">
            {storages
              .filter((storage) =>
                storage.name.toLowerCase().includes(searchStorage.toLowerCase())
              )
              .map((storage) => (
                <Card key={storage?.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>
                        <Link
                          href={`/admin/branches/${branchId}/storage/${storage.id}`}
                          className="text-xl"
                        >
                          {storage?.name}
                        </Link>
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          onClick={() =>
                            handleEdit(
                              "storages",
                              storage.id,
                              prompt("Yangi nomni kiriting:")
                            )
                          }
                        >
                          <Edit />
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDelete("storages", storage.id)}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            {storages.length === 0 && (
              <p>
                Xonalar yo'q.
                <Database />
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchIdPage;
