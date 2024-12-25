"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
  TableBody,
} from "@/components/ui/table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FileText,
  Filter,
  FilterX,
  PrinterCheck,
  TableProperties,
} from "lucide-react";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      const historyRef = collection(db, "history");
      const q = query(historyRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const fetchedHistory = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(fetchedHistory);
      setFilteredHistory(fetchedHistory);
    };

    fetchHistory();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = history.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.inventoryNumber.toLowerCase().includes(query)
    );
    setFilteredHistory(filtered);
  };

  const handleFilterByDate = () => {
    if (startDate && endDate) {
      const filtered = history.filter((item) => {
        const createdAt = item.createdAt.toDate();
        const start = new Date(startDate);
        const end = new Date(endDate);
        return createdAt >= start && createdAt <= end;
      });
      setFilteredHistory(filtered);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setFilteredHistory(history);
  };

  const handlePrint = () => {
    const printContent = document.getElementById("table-content").innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableData = filteredHistory.map((item) => [
      item.name,
      item.inventoryNumber,
      item.quantity,
      item.equpmentType,
      item.equipmentStatus,
      item.location, // Xona yoki sklad
      item.totalPrice,
      item.addedBy,
      item.createdAt.toDate().toLocaleString(),
    ]);
    doc.text("Qabul qilish tarixi", 14, 10);
    doc.autoTable({
      head: [
        [
          "Jihoz nomi",
          "Invertar raqami",
          "Soni",
          "Turi",
          "Holati",
          "Joylashuv",
          "Umumiy narx",
          "Kim topshirdi",
          "Qabul qilingan sana",
        ],
      ],
      body: tableData,
    });
    doc.save("history.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredHistory.map((item) => ({
        "Jihoz nomi": item.name,
        "Invertar raqami": item.inventoryNumber,
        Soni: item.quantity,
        Turi: item.equipmentType,
        Holati: item.equipmentStatus,
        Joylashuv: item.location, // Xona yoki sklad
        "Umumiy narx": item.totalPrice,
        "Kim topshirdi": item.addedBy,
        "Qabul qilingan sana": item.createdAt.toDate().toLocaleString(),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "History");
    XLSX.writeFile(workbook, "history.xlsx");
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Qabul qilish tarixi</h1>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Nomi yoki invertar raqami bo'yicha qidirish"
          value={searchQuery}
          onChange={handleSearch}
          disabled={history.length === 0}
        />

        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border rounded p-2"
          disabled={history.length === 0}
        />

        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border rounded p-2"
          disabled={history.length === 0}
        />

        <Button disabled={startDate === "" && endDate === ""} onClick={handleFilterByDate}>
          <Filter />
        </Button>
        <Button
          disabled={startDate === "" && endDate === ""}
          onClick={resetFilters}
          variant="outline"
        >
          <FilterX />
        </Button>
        <Button disabled={history.length === 0} onClick={exportToPDF}>
          <FileText />
        </Button>
        <Button disabled={history.length === 0} onClick={exportToExcel}>
          <TableProperties />
        </Button>
        <Button disabled={history.length === 0} onClick={handlePrint}>
          <PrinterCheck />
        </Button>
      </div>

      <div id="table-content">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>
                <strong>Jihoz nomi</strong>
              </TableCell>
              <TableCell>
                <strong>Invertar raqami</strong>
              </TableCell>
              <TableCell>
                <strong>Turi</strong>
              </TableCell>
              <TableCell>
                <strong>Holati</strong>
              </TableCell>
              <TableCell>
                <strong>Joylashuv</strong>
              </TableCell>
              <TableCell>
                <strong>Soni</strong>
              </TableCell>
              <TableCell>
                <strong>Dona narxi</strong>
              </TableCell>
              <TableCell>
                <strong>Umumiy narx</strong>
              </TableCell>
              <TableCell>
                <strong>Kim topshirdi</strong>
              </TableCell>
              <TableCell>
                <strong>Qabul qildi</strong>
              </TableCell>
              <TableCell>
                <strong>Qabul qilingan sana</strong>
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.inventoryNumber}</TableCell>
                <TableCell>{item.equpmentType}</TableCell>
                <TableCell>{item.equipmentStatus}</TableCell>
                <TableCell>{item.path}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.unitPrice?.toLocaleString()}</TableCell>
                <TableCell>{item.totalPrice?.toLocaleString()}</TableCell>
                <TableCell>{item.addedBy}</TableCell>
                <TableCell>{item.responsiblePerson}</TableCell>
                <TableCell>
                  {item.createdAt.toDate().toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
