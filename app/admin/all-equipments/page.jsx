"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import * as XLSX from "xlsx"; // For export functionality
import { FileSpreadsheet, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/app/(components)/TableSkeleton";

export default function EquipmentList() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [calendarOpen, setCalendarOpen] = useState({
    start: false,
    end: false,
  });
  const [loading, setLoading] = useState(true);

  const fetchEquipment = async () => {
    setLoading(true);
    const allEquipment = [];
    const branchesSnapshot = await getDocs(collection(db, "branches"));

    for (const branch of branchesSnapshot.docs) {
      const branchId = branch.id;
      const roomsSnapshot = await getDocs(
        collection(db, `branches/${branchId}/rooms`)
      );

      for (const room of roomsSnapshot.docs) {
        const roomId = room.id;
        const equipmentSnapshot = await getDocs(
          collection(db, `branches/${branchId}/rooms/${roomId}/equipment`)
        );
        equipmentSnapshot.forEach((doc) => {
          allEquipment.push({
            id: doc.id,
            branch: branch.data().name || branchId,
            room: room.data().name || roomId,
            ...doc.data(),
          });
        });
      }

      const storageSnapshot = await getDocs(
        collection(db, `branches/${branchId}/storages`)
      );
      for (const storage of storageSnapshot.docs) {
        const storageId = storage.id;
        const equipmentSnapshot = await getDocs(
          collection(db, `branches/${branchId}/storages/${storageId}/equipment`)
        );
        equipmentSnapshot.forEach((doc) => {
          allEquipment.push({
            id: doc.id,
            branch: branch.data().name || branchId,
            storage: storage.data().name || storageId,
            ...doc.data(),
          });
        });
      }
    }

    setEquipmentList(allEquipment);
    setFilteredEquipment(allEquipment);
    setTotalEquipment(allEquipment.length);
    setTotalPrice(
      allEquipment.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredEquipment);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Equipments");
    XLSX.writeFile(workbook, "filtered-equipment-data.xlsx");
  };

  function clearFilter() {
    fetchEquipment();
    setSearch("");
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Equipment List</h1>
        <Button onClick={exportToExcel}>
          <FileSpreadsheet size="20px" /> Export to Excel
        </Button>
      </div>
      <Input
        placeholder="Search: Name, Inventory Number, Type, or Status"
        value={search}
        onChange={handleSearch}
      />
      <div className="flex space-x-4 items-center">
        <Button onClick={() => setCalendarOpen({ start: false, end: false })}>
          Yopish
        </Button>
        <Button onClick={clearFilter}>
          <RefreshCcw />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        {loading ? (
          <>
            <Skeleton className="h-4 w-[200px]" />
          </>
        ) : (
          <>
            <strong className="flex gap-2 items-center justify-center">
              Total Equipment: {totalEquipment}
            </strong>
          </>
        )}

        {loading ? (
          <>
            <Skeleton className="h-4 w-[200px]" />
          </>
        ) : (
          <>
            <strong className="flex gap-2 items-center justify-center">
              Total Price: {totalPrice.toLocaleString()} UZS
            </strong>
          </>
        )}
      </div>
      {loading ? (
        <TableSkeleton />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Inventar nomer</TableCell>
              <TableCell>Nomi</TableCell>
              <TableCell>Filial</TableCell>
              <TableCell>Joylashuvi</TableCell>
              <TableCell>Turi</TableCell>
              <TableCell>Holati</TableCell>
              <TableCell>Soni</TableCell>
              <TableCell>Dona narxi</TableCell>
              <TableCell>Ja'mi narxi</TableCell>
              <TableCell>Topshirdi</TableCell>
              <TableCell>Qabul qildi</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.inventoryNumber}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.branch}</TableCell>
                <TableCell>{item.room || item.storage}</TableCell>
                <TableCell>{item.equipmentType}</TableCell>
                <TableCell>{item.equipmentStatus}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice?.toLocaleString()}</TableCell>
                <TableCell>{item.totalPrice?.toLocaleString()}</TableCell>
                <TableCell>{item.addedBy}</TableCell>
                <TableCell>{item.responsiblePerson}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
