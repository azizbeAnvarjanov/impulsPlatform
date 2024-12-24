"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const [branches, setBranches] = useState([]);
  const [branchesWithRooms, setBranchesWithRooms] = useState([]);
  const [branchesWithStorages, setBranchesWithStorages] = useState([]);

  console.log(branchesWithStorages.length);
  

  const [data, setData] = useState({
    totalEquipment: 0,
    totalEquipmentSum: 0,
    equipmentTypes: 0,
    equipmentStatuses: 0,
    equipmentUnits: 0,
    totalDepartments: 0,
    totalUsers: 0,
    totalRooms: 0,
    totalSklads: 0,
    totalBranches: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Filiallar
        const branchesSnapshot = await getDocs(collection(db, "branches"));
        const branchesData = branchesSnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setBranches(branchesData);

        // Skladlar
        const skladsSnapshot = await getDocs(collection(db, "sklads"));

        // Jihozlar
        const equipmentSnapshot = await getDocs(collection(db, "equipments"));
        const totalEquipmentSum = equipmentSnapshot.docs.reduce(
          (sum, doc) => sum + (doc.data().price || 0),
          0
        );

        // Jihoz Turlari
        const equipmentTypesSnapshot = await getDocs(
          collection(db, "equipmentTypes")
        );

        // Jihoz Statuslari
        const equipmentStatusesSnapshot = await getDocs(
          collection(db, "equipmentStatus")
        );

        // Jihoz O'lchov Birliklari
        const equipmentUnitsSnapshot = await getDocs(
          collection(db, "unitOfMeasurements")
        );

        // Bo'limlar
        const departmentsSnapshot = await getDocs(
          collection(db, "departments")
        );

        // Foydalanuvchilar
        const usersSnapshot = await getDocs(collection(db, "users"));

        // Xonalar
        const roomsSnapshot = await getDocs(collection(db, "rooms"));

        // Data yangilash
        setData({
          totalEquipment: equipmentSnapshot.docs.length,
          totalEquipmentSum,
          equipmentTypes: equipmentTypesSnapshot.docs.length,
          equipmentStatuses: equipmentStatusesSnapshot.docs.length,
          equipmentUnits: equipmentUnitsSnapshot.docs.length,
          totalDepartments: departmentsSnapshot.docs.length,
          totalUsers: usersSnapshot.docs.length,
          totalRooms: roomsSnapshot.docs.length,
          totalSklads: skladsSnapshot.docs.length,
          totalBranches: branchesData.length,
        });
      } catch (error) {
        console.error("Ma'lumotlarni olishda xato:", error);
      }
    };

    const fetchBranchesAndRooms = async () => {
        try {
          // Filiallarni olish
          const branchesSnapshot = await getDocs(collection(db, "branches"));
          const branchesData = branchesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          // Har bir filial uchun xonalarni olish
          branchesData.map(async (branch) => {
            const roomsData = await getDocs(
                query(collection(db, `branches/${branch.id}/rooms`))
              );
              console.log(branch.id);
              
            const storageData = await getDocs(
                query(collection(db, `branches/${branch.id}/storages`))
              );
              setBranchesWithStorages(storageData.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
          });
  
        } catch (error) {
          console.error("Filiallar va xonalarni olishda xato:", error);
        }
      };
  
      fetchBranchesAndRooms();

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Umumiy Jihozlar</CardTitle>
        </CardHeader>
        <CardContent>{data.totalEquipment}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Umumiy Jihozlar Summasi</CardTitle>
        </CardHeader>
        <CardContent>{data.totalEquipmentSum.toLocaleString()}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Jihoz Turlari</CardTitle>
        </CardHeader>
        <CardContent>{data.equipmentTypes}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Jihoz Statuslari</CardTitle>
        </CardHeader>
        <CardContent>{data.equipmentStatuses}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Jihoz O'lchov Birliklari</CardTitle>
        </CardHeader>
        <CardContent>{data.equipmentUnits}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bo'limlar</CardTitle>
        </CardHeader>
        <CardContent>{data.totalDepartments}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Foydalanuvchilar</CardTitle>
        </CardHeader>
        <CardContent>{data.totalUsers}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Xonalar</CardTitle>
        </CardHeader>
        <CardContent>{branchesWithRooms.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Skladlar</CardTitle>
        </CardHeader>
        <CardContent>{branchesWithStorages.length}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Filiallar</CardTitle>
        </CardHeader>
        <CardContent>{branches?.length}</CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
