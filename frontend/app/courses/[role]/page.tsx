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
  const [courses, setCourses] = useState<Course[]>([]); // State to store courses
  const role = pathname?.split("/").pop(); // Extract role from URL

  useEffect(() => {
    // Redirect to 404 if role is invalid
    if (!role || !["student", "teacher", "admin"].includes(role)) {
      router.push("/404");
      return;
    }

    // Fetch courses based on role
    const fetchCourses = async () => {
      const token = localStorage.getItem("accessToken"); // Retrieve token from localStorage

      try {
        // Set endpoint dynamically based on role
        let endpoint = "";
        if (role === "admin") {
          endpoint = "http://localhost:3000/courses/all"; // Admin fetches all courses
        } else if (role === "teacher") {
          endpoint = "http://localhost:3000/courses/teacher"; // Teacher-specific courses
        } else if (role === "student") {
          endpoint = "http://localhost:3000/courses/student"; // Student-specific courses
        }

        // Make API call to the resolved endpoint
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        console.log("API Response:", response.data); // Log API response for debugging
        setCourses(response.data); // Update state with fetched courses
      } catch (error) {
        console.error("Error fetching courses:", error);

        // Redirect to login if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          router.push("/login");
        } else {
          // Show error for other cases
          console.error("Failed to fetch courses. Please try again.");
        }
      }
    };

    fetchCourses(); // Call fetchCourses on component mount
  }, [role, router]);

  return (
    <div>
      {role ? (
        <>
          <h1>{role.charAt(0).toUpperCase() + role.slice(1)} Courses</h1>
          <ul>
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course, index) => (
                <li key={course.id || course.title || index}>
                  {course.title} {/* Display course title */}
                </li>
              ))
            ) : (
              <p>No courses available</p> // Show message if no courses found
            )}
          </ul>
        </>
      ) : (
        <h1>Loading...</h1> // Show loading state
      )}
    </div>
  );
};

export default RoleBasedCourses; // Export the component
