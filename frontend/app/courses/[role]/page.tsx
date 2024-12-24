"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";

interface Course {
  id: string; // Update this type based on your backend response
  title: string;
}

const RoleBasedCourses = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [courses, setCourses] = useState<Course[]>([]);
  const role = pathname?.split("/").pop(); // Extract role from URL

  useEffect(() => {
    if (!role || !["student", "teacher", "admin"].includes(role)) {
      router.push("/404"); // Redirect to 404 for invalid roles
      return;
    }

    // Fetch courses based on role
    const fetchCourses = async () => {
      const token = localStorage.getItem("accessToken"); // Add token
      try {
        // Dynamically set endpoint based on role
        const endpoint = role === "admin" ? "http://localhost:3000/courses/all" : `http://localhost:3000/courses/${role}`;

        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("API Response:", response.data); // Debugging
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login"); // Redirect to login on unauthorized
        }
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
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course, index) => {
                return <li key={course.id || course.title || index}>{course.title}</li>; // Fallback to index if no unique property is found
              })
            ) : (
              <p>No courses available</p>
            )}
          </ul>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
    </div>
  );
};

export default RoleBasedCourses;
