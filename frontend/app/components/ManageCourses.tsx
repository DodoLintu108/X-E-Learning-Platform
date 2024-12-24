import { toast } from "react-toastify";
import axios from "axios";

const ManageCourses = ({
  title,
  allCourses,
  fetchCourses,
  showCreate,
  showEdit,
  showDelete,
  allowEnroll,
}: {
  title: string;
  allCourses: any[];
  fetchCourses: () => void;
  showCreate: boolean;
  showEdit: boolean;
  showDelete: boolean;
  allowEnroll?: boolean;
}) => {
  const handleEnroll = async (id: string) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/courses/enroll`,
        { courseId: id }
      );
      toast.success(response.data.message);
      fetchCourses(); // Refresh courses
    } catch (error) {
      console.error("Error enrolling in course:", error);
      toast.error("Error enrolling in course!");
    }
  };


  
  return (
    <div>
      <h1>{title}</h1>
      <div>
        {allCourses.map((course: any) => (
          <div
            key={course._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "10px",
              boxShadow: "1px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>

            {allowEnroll && (
              <button
                onClick={() => handleEnroll(course._id)}
                style={{
                  padding: "10px",
                  backgroundColor: "#7AB2D3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Enroll
              </button>
            )}

            {showEdit && (
              <button
                style={{
                  marginLeft: "10px",
                  padding: "10px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Edit
              </button>
            )}

            {showDelete && (
              <button
                style={{
                  marginLeft: "10px",
                  padding: "10px",
                  backgroundColor: "#F44336",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // Add delete handler here
                }}
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {showCreate && (
        <button
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#7AB2D3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={() => {
            // Add create handler here
          }}
        >
          Create Course
        </button>
      )}
    </div>
  );
};

export default ManageCourses;
