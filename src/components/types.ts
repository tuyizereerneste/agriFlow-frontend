export interface Farmer {
    id: string;
    name: string;
  }
  
  export interface Land {
    id: string;
    name: string;
  }
  
  export interface PracticeAssignment {
    targetPracticeId: string;
    landIds: string[];
  }
  
  export interface EnrollFarmerPayload {
    farmerId: string;
    projectId: string;
    assignments: PracticeAssignment[];
  }

  export interface TargetPractice {
    id: string;
    title: string;
    activities?: Activity[];
    // other properties
  }
  
  export interface Project {
    id: string;
    title: string;
    practices: TargetPractice[];
  }
  
  export interface Activity {
    id: string;
    startDate: string;
    endDate: string;
    title: string;
    // other properties
  }
  export interface AttendanceRecord {
    id: string;
    activityId: string;
    farmerId: string;
    photos: string[];
    notes: string;
    createdAt: string;
  }