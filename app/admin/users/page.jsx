"use client";
import { useState, useEffect } from "react";
import { db, auth } from "../../firebase"; // Firebase'ni import qilish
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Xodim",
    department: "",
  });
  const [loading, setLoading] = useState(false);

  const usersRef = collection(db, "users");
  const departmentsRef = collection(db, "departments");

  // Foydalanuvchilarni yuklash
  const fetchUsers = async () => {
    const data = await getDocs(usersRef);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Bo'limlarni yuklash
  const fetchDepartments = async () => {
    const data = await getDocs(departmentsRef);
    setDepartments(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role || !newUser.department) {
      alert("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }
  
    setLoading(true);
    try {
      // 1. Firebase Auth orqali foydalanuvchini ro'yxatdan o'tkazish
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
  
      const userId = userCredential.user.uid;
  
      // 2. Firestore'ga foydalanuvchi ma'lumotlarini yozish (UID bilan hujjat yaratish)
      await setDoc(doc(usersRef, userId), {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        authId: userId, // Foydalanuvchining UID'si
      });
  
      // 3. Tanlangan bo'limga foydalanuvchi qo'shish
      await setDoc(
        doc(db, "departments", newUser.department, "users", userId),
        {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        }
      );
  
      // 4. Foydalanuvchilar ro'yxatini yangilash
      fetchUsers();
  
      // Formani tozalash
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "Xodim",
        department: "",
      });
  
      // Adminga tasdiq xabarini ko'rsatish
      alert("Foydalanuvchi muvaffaqiyatli qo'shildi!");
    } catch (error) {
      console.error("Foydalanuvchini qo'shishda xatolik:", error);
      alert("Foydalanuvchini qo'shishda xatolik yuz berdi.");
    } finally {
      setLoading(false);
    }
  };
  

  // Foydalanuvchini o'chirish
  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      fetchUsers();
    } catch (error) {
      console.error("Foydalanuvchini o'chirishda xatolik:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Foydalanuvchilar</h1>

      {/* Foydalanuvchini qo'shish formasi */}
      <form onSubmit={handleAddUser} className="mb-4 flex flex-col gap-4">
        <input
          type="text"
          placeholder="Foydalanuvchi ismi"
          value={newUser.name}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, name: e.target.value }))
          }
          className="border p-2 rounded-md"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, email: e.target.value }))
          }
          className="border p-2 rounded-md"
        />
        <input
          type="password"
          placeholder="Parol kiriting"
          value={newUser.password}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, password: e.target.value }))
          }
          className="border p-2 rounded-md"
        />
        <select
          value={newUser.role}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, role: e.target.value }))
          }
          className="border p-2 rounded-md"
        >
          <option value="Admin">Admin</option>
          <option value="Xodim">Xodim</option>
          <option value="Skladchi">Skladchi</option>
          <option value="Ta'minotchi">Ta'minotchi</option>
          <option value="Rektor">Rektor</option>
        </select>
        <select
          value={newUser.department}
          onChange={(e) =>
            setNewUser((prev) => ({ ...prev, department: e.target.value }))
          }
          className="border p-2 rounded-md"
        >
          <option value="">Bo'lim tanlang</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="py-2 px-4 rounded-md bg-blue-500 text-white"
        >
          {loading ? "Yuklanmoqda..." : "Qo'shish"}
        </button>
      </form>

      {/* Foydalanuvchilar ro'yxati */}
      <div>
        {users.map((user) => (
          <div
            key={user.id}
            className="flex justify-between items-center bg-gray-100 p-4 rounded-md mb-2"
          >
            <span>
              {user.name} - {user.email} ({user.role}) -{" "}
              {user.department || "Bo'lim tanlanmagan"}
            </span>
            <button
              onClick={() => handleDeleteUser(user.id)}
              className="text-red-500"
            >
              O'chirish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Users;
