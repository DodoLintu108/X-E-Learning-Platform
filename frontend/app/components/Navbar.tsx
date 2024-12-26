// Navigation bar for the application
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | "">("");
  const [role, setRole] = useState<string | "">("");
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userIDd = localStorage.getItem("userID");
    const role = localStorage.getItem("userRole");
    console.log(role);
    setRole(role || "");
    setAccessToken(token);
    setUserID(userIDd || "");
  }, []);
  const pathname = usePathname();
  console.log("currentPath", pathname);
  return (
    <nav style={styles.navbar}>
      <div style={styles.logo}>
        <Link href="/">E-Learning</Link>
      </div>
      <ul style={styles.navLinks}>
        {pathname != "/" && (
          <>
            {" "}
            {role == "student" && (
              <li>
                <Link href="/courses/student">Student Dashboard</Link>
              </li>
            )}
            {role == "teacher" && (
              <li>
                <Link href="/courses/teacher">Instructor Dashboard</Link>
              </li>
            )}
            {role == "admin" && (
              <li>
                <Link href="/courses/admin">Admin Dashboard</Link>
              </li>
            )}
            {role != "student" && (
              <li>
                <Link href="/courses/create">Create Course</Link>
              </li>
            )}
            <li>
              <Link href="/profile">Profile</Link>
            </li>
          </>
        )}
        <li>
          <Link href="/Login">Login</Link>
        </li>
        <li>
          <Link href="/Register">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 20px",
    backgroundColor: "#4A90E2",
    color: "#fff",
  },
  logo: {
    fontSize: "20px",
    fontWeight: "bold",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "15px",
  },
};

export default Navbar;
