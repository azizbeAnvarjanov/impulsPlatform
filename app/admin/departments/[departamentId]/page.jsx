"use client";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "@/app/firebase";

const DepartamentId = () => {
  const params = useParams();
  const departamentId = params.departamentId;
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Firebase'dan departament foydalanuvchilarini olish
  const fetchDepartmentUsers = async () => {
    if (!departamentId) return;

    setLoading(true);
    try {
      const usersRef = collection(db, `departments/${departamentId}/users`);
      const userDocs = await getDocs(usersRef);

      const usersList = userDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(usersList);
    } catch (error) {
      console.error("Xatolik foydalanuvchilarni olishda:", error);
    } finally {
      setLoading(false);
    }
  };

  // Firebase'dan barcha foydalanuvchilarni olish
  const fetchAllUsers = async () => {
    try {
      const usersRef = collection(db, "users");
      const userDocs = await getDocs(usersRef);

      const usersList = userDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Departamentda allaqachon mavjud bo'lgan foydalanuvchilarni chiqarib tashlash
      const filteredUsers = usersList.map((user) => {
        const isInDepartment = users.some((deptUser) => deptUser.id === user.id);
        return { ...user, disabled: isInDepartment };
      });

      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Xatolik barcha foydalanuvchilarni olishda:", error);
    }
  };

  // Foydalanuvchini departamentdan chiqarish
  const removeUserFromDepartment = async (userId) => {
    if (!departamentId || !userId) return;

    try {
      await deleteDoc(doc(db, `departments/${departamentId}/users`, userId));
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log(`Foydalanuvchi ${userId} o'chirildi.`);
    } catch (error) {
      console.error("Xatolik foydalanuvchini o'chirishda:", error);
    }
  };

  // Foydalanuvchini departamentga qo'shish
  const addUserToDepartment = async () => {
    if (!departamentId || !selectedUser) return;

    try {
      const userDocRef = doc(db, `departments/${departamentId}/users`, selectedUser.id);
      await setDoc(userDocRef, selectedUser);

      setUsers((prevUsers) => [...prevUsers, selectedUser]);
      setAllUsers((prevAllUsers) =>
        prevAllUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, disabled: true } : user
        )
      );
      setSelectedUser(null);

      console.log(`Foydalanuvchi ${selectedUser.id} qo'shildi.`);
    } catch (error) {
      console.error("Xatolik foydalanuvchini qo'shishda:", error);
    }
  };

  useEffect(() => {
    fetchDepartmentUsers();
  }, [departamentId]);

  useEffect(() => {
    fetchAllUsers();
  }, [users]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Departament ID: {departamentId}</h1>

      {loading ? (
        <p>Yuklanmoqda...</p>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Foydalanuvchilar ({users.length}):
          </h2>
          <ul className="list-disc list-inside mb-4">
            {users.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>
                  {user.name} - {user.email} ({user.role})
                </span>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => removeUserFromDepartment(user.id)}
                >
                  O'chirish
                </button>
              </li>
            ))}
          </ul>

          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Foydalanuvchi qo'shish:</h2>
            <select
              className="border p-2 rounded mb-2"
              value={selectedUser?.id || ""}
              onChange={(e) =>
                setSelectedUser(allUsers.find((user) => user.id === e.target.value))
              }
            >
              <option value="" disabled>
                Foydalanuvchini tanlang
              </option>
              {allUsers.map((user) => (
                <option key={user.id} value={user.id} disabled={user.disabled}>
                  {user.name} - {user.email} ({user.role})
                </option>
              ))}
            </select>
            <button
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={addUserToDepartment}
              disabled={!selectedUser}
            >
              Qo'shish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartamentId;
