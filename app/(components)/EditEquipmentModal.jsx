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
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { Edit } from "lucide-react";
import { toast } from "react-hot-toast";

export const EditEquipmentModal = ({ equipment, branchId, id, path }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form field states
  const [formState, setFormState] = useState({
    name: equipment.name,
    equpmentType: equipment.equpmentType,
    equipmentStatus: equipment.equipmentStatus,
    unitOfMeasurement: equipment.unitOfMeasurement,
    quantity: equipment.quantity,
    unitPrice: equipment.unitPrice,
    inventoryNumber: equipment.inventoryNumber,
    responsiblePerson: equipment.responsiblePerson,
    addedBy: equipment.addedBy,
  });

  const [users, setUsers] = useState([]);
  const [equpmentTypes, setEqupmentTypes] = useState([]);
  const [unitOfMeasurements, setUnitOfMeasurements] = useState([]);
  const [equipmentStatuses, setEquipmentStatuses] = useState([]);

  useEffect(() => {
    const fetchData = async (collectionName, setState) => {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const list = querySnapshot.docs
        .map((doc) => doc.data())
        .sort((a, b) => new Date(b.receivedAt) - new Date(a.receivedAt)); // Sort by date descending
      setState(list.map((item) => item.name));
    };

    fetchData("users", setUsers);
    fetchData("equipmentTypes", setEqupmentTypes);
    fetchData("unitOfMeasurements", setUnitOfMeasurements);
    fetchData("equipmentStatus", setEquipmentStatuses);
  }, []);

  const handleInputChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateEquipment = async () => {
    if (!formState.name || !formState.quantity || !formState.unitPrice) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    const updatedTotalPrice = formState.quantity * formState.unitPrice;

    const equipmentRef = doc(
      db,
      `branches/${branchId}/${path}/${id}/equipment`,
      equipment.id
    );

    const updatedData = {
      ...formState,
      totalPrice: updatedTotalPrice,
      updatedAt: new Date(),
    };

    setLoading(true);
    try {
      await updateDoc(equipmentRef, updatedData);
      toast.success("Jihoz muvaffaqiyatli yangilandi!");
      setOpen(false);
    } catch (error) {
      console.error("Yangilashda xatolik yuz berdi: ", error);
      toast.error("Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setOpen(false);
    setFormState({
      name: equipment.name,
      equpmentType: equipment.equpmentType,
      equipmentStatus: equipment.equipmentStatus,
      unitOfMeasurement: equipment.unitOfMeasurement,
      quantity: equipment.quantity,
      unitPrice: equipment.unitPrice,
      inventoryNumber: equipment.inventoryNumber,
      responsiblePerson: equipment.responsiblePerson,
      addedBy: equipment.addedBy,
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Edit />
      </Button>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jihozni tahrirlash</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              placeholder="Invertar raqam"
              value={formState.inventoryNumber}
              onChange={(e) =>
                handleInputChange("inventoryNumber", e.target.value)
              }
            />
            <Input
              placeholder="Jihoz nomi"
              value={formState.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <Input
              placeholder="Soni"
              type="number"
              value={formState.quantity}
              onChange={(e) => handleInputChange("quantity", +e.target.value)}
            />
            <Input
              placeholder="Dona narxi"
              type="number"
              value={formState.unitPrice}
              onChange={(e) => handleInputChange("unitPrice", +e.target.value)}
            />

            <Select
              onValueChange={(value) =>
                handleInputChange("responsiblePerson", value)
              }
              value={formState.responsiblePerson}
            >
              <SelectTrigger className="w-full">
                {formState.responsiblePerson || "Mas’ul shaxsni tanlang"}
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
              onValueChange={(value) => handleInputChange("addedBy", value)}
              value={formState.addedBy}
            >
              <SelectTrigger className="w-full">
                {formState.addedBy || "Mas’ul shaxsni tanlang"}
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
              onValueChange={(value) =>
                handleInputChange("unitOfMeasurement", value)
              }
              value={formState.unitOfMeasurement}
            >
              <SelectTrigger className="w-full">
                {formState.unitOfMeasurement || "O'lchov birligini tanlang"}
              </SelectTrigger>
              <SelectContent>
                {unitOfMeasurements?.map((unit, idx) => (
                  <SelectItem key={idx} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleInputChange("equpmentType", value)
              }
              value={formState.equpmentType}
            >
              <SelectTrigger className="w-full">
                {formState.equpmentType || "Jihoz turini tanlang"}
              </SelectTrigger>
              <SelectContent>
                {equpmentTypes?.map((type, idx) => (
                  <SelectItem key={idx} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              onValueChange={(value) =>
                handleInputChange("equipmentStatus", value)
              }
              value={formState.equipmentStatus}
            >
              <SelectTrigger className="w-full">
                {formState.equipmentStatus || "Jihoz holatini tanlang"}
              </SelectTrigger>
              <SelectContent>
                {equipmentStatuses?.map((status, idx) => (
                  <SelectItem key={idx} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={updateEquipment} disabled={loading}>
              {loading ? "Yuklanmoqda..." : "Yangilash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
