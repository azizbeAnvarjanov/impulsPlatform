"use client";
import React, { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebase";
import { Additem } from "@/app/(components)/AddItem";
import { Deleteitem } from "@/app/(components)/Deleteitem";
import { EditItem } from "@/app/(components)/Edititem";

const Sozlamalar = () => {
  const [allequipmentTypes, setAllequipmentTypes] = useState([]);
  const [allequipmentStatuses, setAllequipmentStatuses] = useState([]);
  const [unitOfMeasurements, setUnitOfMeasurements] = useState([]);
  const equipmentRef = collection(db, "equipmentTypes");
  const equipmentStatusesRef = collection(db, "equipmentStatus");
  const unitOfMeasurementsRef = collection(db, "unitOfMeasurements");

  // Filiallarni olish funksiyasi
  const fetching = async () => {
    const allEquipmentData = await getDocs(equipmentRef);
    const allequipmentStatusesData = await getDocs(equipmentStatusesRef);
    const unitOfMeasurementsData = await getDocs(unitOfMeasurementsRef);
    setAllequipmentTypes(
      allEquipmentData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
    setAllequipmentStatuses(
      allequipmentStatusesData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
    setUnitOfMeasurements(
      unitOfMeasurementsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );
  };

  useEffect(() => {
    fetching();
  }, []);

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 w-full gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <strong>Jihoz turlari</strong>
            <Additem fetching={fetching} path="equipmentTypes" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <strong>Nomi</strong>
                </TableCell>
                <TableCell>
                  <strong>Amallar</strong>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allequipmentTypes.map((equipmentType) => (
                <TableRow key={equipmentType.id}>
                  <TableCell className="font-medium">
                    {equipmentType.name}
                  </TableCell>
                  <TableCell className="font-medium flex gap-2 items-center justify-end border-none">
                    <EditItem
                      path="equipmentTypes"
                      itemId={equipmentType.id}
                      fetching={fetching}
                      itemName={equipmentType.name}
                    />
                    <Deleteitem
                      path="equipmentTypes"
                      itemId={equipmentType.id}
                      fetching={fetching}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <strong>Jihoz statuslari</strong>
            <Additem fetching={fetching} path="equipmentStatus" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <strong>Nomi</strong>
                </TableCell>
                <TableCell>
                  <strong>Amallar</strong>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allequipmentStatuses.map((equipmentType) => (
                <TableRow key={equipmentType.id}>
                  <TableCell className="font-medium">
                    {equipmentType.name}
                  </TableCell>
                  <TableCell className="font-medium flex gap-2 items-center justify-end border-none">
                    <EditItem
                      path="equipmentStatus"
                      itemId={equipmentType.id}
                      fetching={fetching}
                      itemName={equipmentType.name}
                    />
                    <Deleteitem
                      path="equipmentStatus"
                      itemId={equipmentType.id}
                      fetching={fetching}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <strong>Jihoz o'lchov birliklari</strong>
            <Additem fetching={fetching} path="unitOfMeasurements" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>
                  <strong>Nomi</strong>
                </TableCell>
                <TableCell>
                  <strong>Amallar</strong>
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unitOfMeasurements.map((equipmentType) => (
                <TableRow key={equipmentType.id}>
                  <TableCell className="font-medium">
                    {equipmentType.name}
                  </TableCell>
                  <TableCell className="font-medium flex gap-2 items-center justify-end border-none">
                    <EditItem
                      path="unitOfMeasurements"
                      itemId={equipmentType.id}
                      fetching={fetching}
                      itemName={equipmentType.name}
                    />
                    <Deleteitem
                      path="unitOfMeasurements"
                      itemId={equipmentType.id}
                      fetching={fetching}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Sozlamalar;
