"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  FileSpreadsheet,
  FileText,
  PrinterCheck,
  RefreshCcw,
  TableProperties,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TableSkeleton from "@/app/(components)/TableSkeleton";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function EquipmentList() {
  const [equipmentList, setEquipmentList] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [search, setSearch] = useState("");
  const [totalEquipment, setTotalEquipment] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
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
    applyFilters(query);
  };

  const applyFilters = (query) => {
    const filtered = equipmentList.filter((item) => {
      const matchesQuery =
        item.name?.toLowerCase().includes(query) ||
        item.inventoryNumber?.toString().includes(query) ||
        item.equipmentType?.toLowerCase().includes(query) ||
        item.equipmentStatus?.toLowerCase().includes(query);

      return matchesQuery;
    });

    setFilteredEquipment(filtered);
    setTotalEquipment(filtered.length);
    setTotalPrice(
      filtered.reduce((sum, item) => sum + (item.totalPrice || 0), 0)
    );
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredEquipment.map((item) => ({
        "Invertar raqami": item.inventoryNumber,
        "Jihoz nomi": item.name,
        Filial: item.room || item.storage, // Xona yoki sklad
        Joylashuv: item.room || item.storage, // Xona yoki sklad
        Turi: item.equipmentType,
        Holati: item.equipmentStatus,
        Soni: item.quantity,
        "Dona narx": item.unitPrice,
        "Ja'mi narx": item.totalPrice,
        "Kim topshirdi": item.addedBy,
        "Qabul qildi": item.responsiblePerson,
        "Qabul qilingan sana": item.createdAt.toDate().toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");
    XLSX.writeFile(workbook, "history.xlsx");
  };

  function clearFilter() {
    fetchEquipment();
    setSearch("");
  }

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredEquipment.map((item) => [
      item.inventoryNumber,
      item.name,
      item.branch,
      item.room || item.storage,
      item.equpmentType,
      item.equipmentStatus,
      item.quantity,
      item.unitPrice?.toLocaleString(),
      item.totalPrice?.toLocaleString(),
      item.addedBy,
      item.responsiblePerson,
      item.createdAt.toDate().toLocaleString(),
    ]);
    doc.text("Barcha jihozlar", 14, 10);
    doc.autoTable({
      head: [
        [
          "Invertar raqami",
          "Jihoz nomi",
          "Filial",
          "Joylashuvi",
          "Turi",
          "Holati",
          "Soni",
          "Dona narxi",
          "Ja'mi narxi",
          "Topshirdi",
          "Qabul qildi",
          "Qabul sanasi",
        ],
      ],
      body: tableData,
    });
    doc.save("all-equipments.pdf");
  };

  const handlePrint = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Equipment List</h1>
      </div>
      <Input
        placeholder="Search: Name, Inventory Number, Type, or Status"
        value={search}
        onChange={handleSearch}
        disabled={filteredEquipment.length === 0}
      />
      <div className="flex space-x-4 items-center">
        <Button disabled={filteredEquipment.length === 0} onClick={clearFilter}>
          <RefreshCcw />
        </Button>
        <Button disabled={filteredEquipment.length === 0} onClick={exportToPDF}>
          <FileText />
        </Button>
        <Button disabled={filteredEquipment.length === 0} onClick={handlePrint}>
          <PrinterCheck />
        </Button>
        <Button disabled={filteredEquipment.length === 0} onClick={exportToExcel}>
          <TableProperties size="20px" />{" "}
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
        <div id="table-content">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  {loading ? <>loadin...</> : <>Qabul sanasi</>}
                </TableCell>
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
                  <TableCell>
                    {item.createdAt?.toDate().toLocaleString()}
                  </TableCell>
                  <TableCell>{item.inventoryNumber}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.branch}</TableCell>
                  <TableCell>{item.room || item.storage}</TableCell>
                  <TableCell>{item.equpmentType}</TableCell>
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
        </div>
      )}
    </div>
  );
}
