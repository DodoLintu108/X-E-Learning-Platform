"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

const RoleBasedCourses = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [courses, setCourses] = useState([]);
  const role = pathname?.split("/").pop(); // Extract role from URL

  useEffect(() => {
    if (!role || !["student", "teacher", "admin"].includes(role)) {
      router.push("/404"); // Redirect to 404 for invalid roles
      return;
    }

    // Fetch courses based on role
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/courses/${role}`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [role, router]);

  return (
    <div>
      {role ? (
        <>
          <h1>{role.charAt(0).toUpperCase() + role.slice(1)} Courses</h1>
          <ul>
            {courses.map((course: any) => (
              <li key={course.id}>{course.title}</li>
            ))}
          </ul>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default RoleBasedCourses;
