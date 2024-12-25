"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Delete, Edit, ExpandIcon, FileSpreadsheet, Trash } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx"; // Export uchun kerak
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
} from "firebase/firestore"; // Firestore ma'lumotlar uchun
import { EditEquipmentModal } from "./EditEquipmentModal";
import { DeleteEquipmentModal } from "./DeleteEquipmentModal";
import toast from "react-hot-toast";
import MoveRoomModal from "./MoveRoomModal";
import Link from "next/link";

const EquipmentTableMain = ({ branchId, id, path }) => {
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    unit: "",
  });

  

  const db = getFirestore();
  const collectionRef = collection(
    db,
    `branches/${branchId}/${path}/${id}/equipment`
  );

  // Realtime data o'qish
  useEffect(() => {
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEquipment(data);
      setFilteredEquipment(data); // Filterlash uchun asosan ma'lumot
    });

    return () => unsubscribe(); // Komponent unmounted bo'lsa, listenerni to'xtatish
  }, []);

  // Qidiruv va filtrlarni qo'llash
  useEffect(() => {
    if (searchQuery || filters.type || filters.status || filters.unit) {
      let updatedEquipment = equipment;

      if (searchQuery) {
        updatedEquipment = updatedEquipment.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (filters.type) {
        updatedEquipment = updatedEquipment.filter(
          (item) => item.equpmentType === filters.type
        );
      }

      if (filters.status) {
        updatedEquipment = updatedEquipment.filter(
          (item) => item.equipmentStatus === filters.status
        );
      }

      if (filters.unit) {
        updatedEquipment = updatedEquipment.filter(
          (item) => item.unitOfMeasurement === filters.unit
        );
      }

      setFilteredEquipment(updatedEquipment);
    } else {
      setFilteredEquipment(equipment);
    }
  }, [searchQuery, filters, equipment]);

  // Ma'lumotlarni eksport qilish funksiyasi
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEquipment);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipment");
    XLSX.writeFile(workbook, "equipment_data.xlsx");
  };

  // Faylni import qilish funksiyasi
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true); // Loading boshlash
    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const data = XLSX.utils.sheet_to_json(
        workbook.Sheets[workbook.SheetNames[0]]
      );

      try {
        for (const item of data) {
          await addDoc(collectionRef, {
            ...item,
            createdAt: new Date(), // Hozirgi vaqtni qo'shish
          });
        }
        toast.success("Fayl muvaffaqiyatli yuklandi!"); // Alert muvaffaqiyat
      } catch (err) {
        console.error("Error adding document: ", err);
        toast.error("Xatolik yuz berdi!"); // Alert xatolik
      } finally {
        setLoading(false); // Loading tugadi
      }
    };
    reader.readAsBinaryString(file);
  };

  // Umumiy summani hisoblash
  const calculateTotalPrice = (data) => {
    return data.reduce((total, item) => total + (item.totalPrice || 0), 0);
  };

  // Valyutani formatlash
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) {
      return "0"; // Noto‘g‘ri qiymatlar uchun
    }
    return new Intl.NumberFormat("uz-UZ", {
      style: "currency",
      currency: "UZS",
    }).format(amount);
  };

  return (
    <div>
      <div>
        {/* Umumiy summa */}
        <div className="mb-4 p-4 bg-gray-100 rounded shadow">
          <strong>
            Umumiy summa:{" "}
            {calculateTotalPrice(filteredEquipment)?.toLocaleString()} so'm
          </strong>
        </div>
        <div className="mb-4">
          <select
            className="border px-4 py-2"
            value={filters.type}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, type: e.target.value }))
            }
          >
            <option value="">Jihoz turi bo'yicha</option>
            {[...new Set(equipment.map((item) => item.equpmentType))].map(
              (type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              )
            )}
          </select>
          <select
            className="border px-4 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">Jihoz holati bo'yicha</option>
            {[...new Set(equipment.map((item) => item.equipmentStatus))].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </select>
          <select
            className="border px-4 py-2"
            value={filters.unit}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, unit: e.target.value }))
            }
          >
            <option value="">O'lchov birligi bo'yicha</option>
            {[...new Set(equipment.map((item) => item.unitOfMeasurement))].map(
              (unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              )
            )}
          </select>
          <Button
            className="bg-red-500 text-white px-4 py-2"
            onClick={() => {
              setFilters({ type: "", status: "", unit: "" });
              setSearchQuery("");
            }}
          >
            Filtrni tozalash
          </Button>
          <br />
        </div>
      </div>
      <div className="mb-4 flex items-center gap-4">
        <Input
          type="text"
          placeholder="Jihoz nomini qidgirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full"
        />
        <Button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={exportToExcel}
        >
          <FileSpreadsheet size="50px" />
        </Button>
        <Input
          type="file"
          onChange={handleFileUpload}
          className="border border-gray-300 rounded p-2"
        />
       
        <Link href="/Import data example.xlsx" passHref>
          <button
            className="px-4 py-2 mt-4 text-white bg-blue-600 rounded hover:bg-blue-700"
            download
          >
            Faylni yuklab olish
          </button>
        </Link>
      </div>

      {loading && (
        <div className="text-center mb-4">
          <span className="text-blue-500">Yuklanmoqda...</span>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>
              <strong>Invertar raqam</strong>
            </TableCell>
            <TableCell>
              <strong>Nomi</strong>
            </TableCell>
            <TableCell>
              <strong>Turi</strong>
            </TableCell>
            <TableCell>
              <strong>Soni</strong>
            </TableCell>
            <TableCell>
              <strong>Dona narxi</strong>
            </TableCell>
            <TableCell>
              <strong>Ja'mi narxi</strong>
            </TableCell>
            <TableCell>
              <strong>Holati</strong>
            </TableCell>
            <TableCell>
              <strong>O'lchov birligi</strong>
            </TableCell>
            <TableCell>
              <strong>Sana</strong>
            </TableCell>
            <TableCell>
              <strong>Topshirdi</strong>
            </TableCell>
            <TableCell>
              <strong>Qabul qildi</strong>
            </TableCell>
            <TableCell>
              <strong>Amallar</strong>
            </TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEquipment.length === 0 ? (
            <TableRow>
              <TableCell colSpan="13" className="text-center">
                Ma'lumotlar topilmadi
              </TableCell>
            </TableRow>
          ) : (
            filteredEquipment.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <strong>{index + 1}</strong>
                </TableCell>
                <TableCell>{item.inventoryNumber}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.equpmentType}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice?.toLocaleString()}</TableCell>
                <TableCell>{item.totalPrice?.toLocaleString()}</TableCell>
                <TableCell>{item.equipmentStatus}</TableCell>
                <TableCell>{item.unitOfMeasurement}</TableCell>
                <TableCell>
                  {item.createdAt?.toDate().toLocaleString()}
                </TableCell>
                <TableCell>{item.addedBy}</TableCell>
                <TableCell>{item.responsiblePerson}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {/* <Edit className="cursor-pointer text-blue-500" /> */}
                    <EditEquipmentModal
                      equipment={item}
                      branchId={branchId}
                      id={id}
                      path={path}
                    />
                    <MoveRoomModal
                      equipment={item}
                      branchId={branchId}
                      path={path}
                      roomId={id}
                    />

                    <DeleteEquipmentModal
                      branchId={branchId}
                      equipmentId={item.id}
                      id={id}
                      path={path}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default EquipmentTableMain;
