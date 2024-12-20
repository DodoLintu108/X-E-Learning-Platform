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

export default function specificCourse() {
  const searchParams = useSearchParams();
  const [courseId, setCourseId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
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
      console.error(error);
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
          textAlign: "center",
          padding: "9px",
          marginTop: "50px",
        }}
      >
        <h1 style={{ fontWeight: "500", fontSize: "35px" }}>{course?.title}</h1>
        <div style={{ display: "flex", flexDirection: "row"  }}>
          <img
            src={`${course?.courseImage}`}
            alt="course"
            width={100}
            height={100}
            style={{
              borderRadius: "4px",
            }}
          />
        </div>
      </div>
    </div>
  );
}
