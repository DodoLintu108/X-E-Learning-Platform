"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../globals.css";
import Navbar from "../../components/Navbar";
import Link from "next/link";
import Lottie from "lottie-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Stars from "../../components/stars";
import { motion } from "framer-motion";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export default function specificCourse() {
  const searchParams = useSearchParams();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [rating, setRating] = useState<number>(0);
  useEffect(() => {
    const token = searchParams.get("accessToken");
    const id = searchParams.get("courseId");
    setCourseId(id);
    setAccessToken(token);
    if (token && id) {
      handleGetCourse(id, token);
    }
    console.log("Extracted Token:", token);
  }, [searchParams]);
  const handleGetCourse = async (id: string, token: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data);
      setCourse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const statusCode = error.response?.status;
        toast.error(
          "Error creating course!",
          error.response?.data || error.message
        );
        if (statusCode === 401) {
          toast.error("Session expired. Redirecting to Login...");
          window.location.href = "/Login";
          return;
        }
      } else {
        console.error("Error:", error);
      }
      toast.error("Error updating course!");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FBFBFB",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <ToastContainer />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "50px",
          height: "100%",
          padding: "9px",
          marginTop: "50px",
        }}
      >
        {" "}
        <div
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1 style={{ fontWeight: "600", fontSize: "30px" }}>
            {course?.title}
          </h1>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            padding: "9px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "9px",
              alignItems: "center",
            }}
          >
            <img
              src={`${course?.courseImage}`}
              alt="course"
              width={600}
              height={160}
              style={{
                borderRadius: "4px",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginLeft: "15px",
            }}
          >
            <div>
              {/* rating here */}

              {/* <div className="flex">
                {[1, 2, 3, 4, 5].map((value) => {
                  return (
                    <motion.div
                      className="relative cursor-pointer"
                      whileTap={{ scale: 0.8 }}
                      whileHover={{ scale: 1.2 }}
                      key={value}
                    >
                      <Star
                        key={value}
                        onClick={() => {
                          setRating(value);
                        }}
                        className={cn(
                          "text-primary bg-transparent transition-all duration-300 ease-in-out",
                          rating >= value ? "fill-primary" : "fill-muted"
                        )}
                      />
                    </motion.div>
                  );
                })}
              </div> */}
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "65%",
                gap: "10px",
              }}
            >
              <p style={{ fontWeight: "400", fontSize: "20px" }}>
                <strong>Course Description :</strong> {course?.description}
              </p>
              <p style={{ fontWeight: "400", fontSize: "20px" }}>
                <strong>Category:</strong> {course?.category}
              </p>
              <p style={{ fontWeight: "400", fontSize: "20px" }}>
                <strong>Course Level:</strong> {course?.difficultyLevel}
              </p>

              <a
                href={`${course?.courseMaterial}`}
                className="w-full text-black hover:text-blue-500 border-none rounded cursor-pointer font-medium text-2xl"
                target="_blank"
                rel="noopener noreferrer"
              >
                Course Material
              </a>

              <Stars rating={course?.rating} />
            </div>
            <Separator />
            <section className="py-4"></section>
          </div>
        </div>
      </div>
    </div>
  );
}
