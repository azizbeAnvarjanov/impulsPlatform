"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { db } from "@/app/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { CircleFadingPlus } from "lucide-react";
import { toast } from "react-hot-toast";

export const AddEquipment = ({ setEquipment, path, branchId, id, pathName }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [equpmentType, setEqupmentType] = useState("");
  const [equipmentStatus, setEquipmentStatus] = useState("");
  const [unitOfMeasurement, setUnitOfMeasurement] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [inventoryNumber, setInventoryNumber] = useState("");
  const [users, setUsers] = useState([]);
  const [equpmentTypes, setEqupmentTypes] = useState([]);
  const [unitOfMeasurements, setUnitOfMeasurements] = useState([]);
  const [equipmentStatuses, setEquipmentStatuses] = useState([]);
  const [selectedUser, setSelectedUser] = useState("Kim topshiryapti");
  const [responsiblePerson, setResponsiblePerson] = useState("Javobgar shaxs");

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList = querySnapshot.docs.map((doc) => doc.data().name);
      setUsers(userList);
    };

    fetchUsers();
    const fetchUqipmentTypes = async () => {
      const querySnapshot = await getDocs(collection(db, "equipmentTypes"));
      const equpmentList = querySnapshot.docs.map((doc) => doc.data().name);
      setEqupmentTypes(equpmentList);
    };

    fetchUqipmentTypes();
    const fetchUnitOfMeasurements = async () => {
      const querySnapshot = await getDocs(collection(db, "unitOfMeasurements"));
      const unitOfMeasurementsList = querySnapshot.docs.map(
        (doc) => doc.data().name
      );
      setUnitOfMeasurements(unitOfMeasurementsList);
    };

    fetchUnitOfMeasurements();
    const fetchEquipmentStatus = async () => {
      const querySnapshot = await getDocs(collection(db, "equipmentStatus"));
      const equipmentStatusList = querySnapshot.docs.map(
        (doc) => doc.data().name
      );
      setEquipmentStatuses(equipmentStatusList);
    };

    fetchEquipmentStatus();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const totalPrice = quantity * unitPrice;
    const equipmentRef = collection(
      db,
      `branches/${branchId}/${path}/${id}/equipment`
    );
    const newEquipment = {
      name,
      equpmentType,
      equipmentStatus,
      unitOfMeasurement,
      quantity,
      unitPrice,
      totalPrice,
      inventoryNumber,
      addedBy: selectedUser,
      responsiblePerson,
    };

    // Add equipment to main collection
    await addDoc(equipmentRef, {
      ...newEquipment,
      createdAt: serverTimestamp(),
    });

    // Save history of the added equipment
    const historyRef = collection(db, "history");
    await addDoc(historyRef, {
      ...newEquipment,
      action: "added",
      path: pathName,
      createdAt: serverTimestamp(),
    });

    // Update the equipment state
    setEquipment((prev) => [...prev, newEquipment]);

    // Reset form fields
    setName("");
    setInventoryNumber("");
    setEquipmentStatus("");
    setEqupmentType("");
    setQuantity(1);
    setUnitOfMeasurement("");
    setResponsiblePerson("");
    setSelectedUser("");
    setUnitPrice(0);
    setOpen(false);
    setLoading(false);
    toast.success("Jihoz muvaffaqiyatli qo'shildi va tarixi saqlandi!");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <CircleFadingPlus />
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jihoz qo'shish</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Invertar raqam"
              value={inventoryNumber}
              onChange={(e) => setInventoryNumber(e.target.value)}
            />
            <Input
              placeholder="Jihoz nomi"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              placeholder="Soni"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(+e.target.value)}
            />
            <Input
              placeholder="Dona narxi"
              type="number"
              value={unitPrice}
              onChange={(e) => setUnitPrice(+e.target.value)}
            />

            <Select onValueChange={setSelectedUser} value={selectedUser}>
              <SelectTrigger className="w-full">{selectedUser}</SelectTrigger>
              <SelectContent>
                {users?.map((user, idx) => (
                  <SelectItem key={idx} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setResponsiblePerson}
              value={responsiblePerson}
            >
              <SelectTrigger className="w-full">
                {responsiblePerson}
              </SelectTrigger>
              <SelectContent>
                {users?.map((user, idx) => (
                  <SelectItem key={idx} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={setUnitOfMeasurement}
              value={unitOfMeasurement}
            >
              <SelectTrigger className="w-full">
                {unitOfMeasurement}
              </SelectTrigger>
              <SelectContent>
                {unitOfMeasurements?.map((user, idx) => (
                  <SelectItem key={idx} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setEqupmentType} value={equpmentType}>
              <SelectTrigger className="w-full">{equpmentType}</SelectTrigger>
              <SelectContent>
                {equpmentTypes?.map((user, idx) => (
                  <SelectItem key={idx} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setEquipmentStatus} value={equipmentStatus}>
              <SelectTrigger className="w-full">
                {equipmentStatus}
              </SelectTrigger>
              <SelectContent>
                {equipmentStatuses?.map((user, idx) => (
                  <SelectItem key={idx} value={user}>
                    {user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Qo'shilmoqda..." : "Qo'shish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
