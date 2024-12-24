import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

const PrivateRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login"); // Agar foydalanuvchi tizimga kirgan bo'lmasa, login sahifasiga yo'naltirish
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Tozalash
  }, [router, requiredRole]);

  if (loading) {
    return <div>Loading...</div>; // Foydalanuvchi tekshirilayotgan paytda "Loading..." ko'rsatish
  }

  return <>{children}</>; // Agar foydalanuvchi tizimga kirgan va ro'l mos bo'lsa, komponentni render qilish
};

export default PrivateRoute;
