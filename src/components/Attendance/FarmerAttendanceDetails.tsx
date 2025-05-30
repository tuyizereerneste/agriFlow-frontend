import React from "react";
import { useLocation } from "react-router-dom";

const AttendanceDetails = () => {
  const { state } = useLocation();
  const { farmerDetails, project, practice, activity } = state || {};

  if (!farmerDetails) {
    return <div>No farmer details available.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Attendance Details</h1>

      {/* Project Details Section */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Details</h2>
        <p className="mb-2"><strong>Title:</strong> {project?.title || "N/A"}</p>
        <p className="mb-2"><strong>Description:</strong> {project?.description || "N/A"}</p>
        <p className="mb-2"><strong>Owner:</strong> {project?.owner?.name || "N/A"}</p>
        <p className="mb-2"><strong>Start Date:</strong> {project?.startDate ? new Date(project.startDate).toLocaleDateString() : "N/A"}</p>
        <p className="mb-2"><strong>End Date:</strong> {project?.endDate ? new Date(project.endDate).toLocaleDateString() : "N/A"}</p>
        <p className="mb-2"><strong>Objectives:</strong> {project?.objectives || "N/A"}</p>
      </div>

      {/* Practice Details Section */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Practice Details</h2>
        <p className="mb-2"><strong>Title:</strong> {practice?.title || "N/A"}</p>
        <p className="mb-2"><strong>Initial Situation:</strong> {practice?.initialSituation || "N/A"}</p>
      </div>

      {/* Activity Details Section */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Activity Details</h2>
        <p className="mb-2"><strong>Title:</strong> {activity?.title || "N/A"}</p>
        <p className="mb-2"><strong>Description:</strong> {activity?.description || "N/A"}</p>
        <p className="mb-2"><strong>Start Date:</strong> {activity?.startDate ? new Date(activity.startDate).toLocaleDateString() : "N/A"}</p>
        <p className="mb-2"><strong>End Date:</strong> {activity?.endDate ? new Date(activity.endDate).toLocaleDateString() : "N/A"}</p>
        <p className="mb-2"><strong>Notes:</strong> {farmerDetails.notes || "N/A"}</p>
      </div>

      {/* Farmer Details Section */}
      <div className="bg-white shadow-md rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Farmer Details</h2>
        <p className="mb-2"><strong>Farmer Number:</strong> {farmerDetails.farmerNumber}</p>
        <p className="mb-2"><strong>Name:</strong> {farmerDetails.names}</p>
        <p className="mb-2"><strong>Gender:</strong> {farmerDetails.gender}</p>
        <p className="mb-2"><strong>Date of Birth:</strong> {new Date(farmerDetails.dob).toLocaleDateString()}</p>
        <p className="mb-2"><strong>Phones:</strong> {farmerDetails.phones.join(", ")}</p>
        <p className="mb-2"><strong>Province:</strong> {farmerDetails.location?.[0]?.province || "N/A"}</p>
        <p className="mb-2"><strong>District:</strong> {farmerDetails.location?.[0]?.district || "N/A"}</p>
        <p className="mb-2"><strong>Sector:</strong> {farmerDetails.location?.[0]?.sector || "N/A"}</p>
        <p className="mb-2"><strong>Cell:</strong> {farmerDetails.location?.[0]?.cell || "N/A"}</p>
        <p className="mb-2"><strong>Village:</strong> {farmerDetails.location?.[0]?.village || "N/A"}</p>
      </div>


      {/* Photos Section */}
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Activity Photos</h2>
        {farmerDetails.photos && farmerDetails.photos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {farmerDetails.photos.map((photo: string, index: number) => {
              console.log(photo);
              return (
                <div key={index} className="border rounded p-2">
                  <img src={photo} alt={`Activity Photo ${index + 1}`} className="w-full h-auto rounded" />
                </div>
              );
            })}
          </div>
        ) : (
          <p>No photos available.</p>
        )}
      </div>

    </div>
  );
};

export default AttendanceDetails;