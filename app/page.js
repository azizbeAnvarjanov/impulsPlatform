"use client";
import Link from "next/link";
import PrivateRoute from "./PrivateRoute";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <PrivateRoute>
      <Button>
        <Link href="/admin">Admin page</Link>
      </Button>
    </PrivateRoute>
  );
}
