import axiosClient from '../../../axiosinstance';

export interface CreateProjectPayload {
  project_name: string;
  project_type_id: number;
  project_status_id: number;
  launch_date: string;
  possession_date: string;
  country: string;
  state: string;
  city: string;
  area_locality: string;
  landmark: string;
  full_address: string;
  pincode: string;
  towers: number;
  units: number;
  rera_registration_number: string;
  rera_registration_date: string;
  rera_expiry_date: string;
  facilities: string[];
  unit_configs: {
    unit_type: string;
    budgets: string[];
  }[];
}

export interface CreateProjectResponse {
  success: boolean;
  message: string;
}

export const createProject = async (payload: CreateProjectPayload): Promise<CreateProjectResponse> => {
  try {
    const response = await axiosClient.post('/projects/create', payload);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as CreateProjectResponse;
    }
    throw error;
  }
};

export interface ProjectApiResponse {
  id: number;
  project_name: string;
  project_type_id: number;
  project_status_id: number;
  launch_date: string;
  possession_date: string;
  country: string;
  state: string;
  city: string;
  area_locality: string;
  landmark: string;
  full_address: string;
  pincode: string;
  towers: number;
  units: number;
  rera_registration_number: string;
  rera_registration_date: string;
  rera_expiry_date: string;
  facilities: string[];
  unit_configs: {
    unit_type: string;
    budgets: string[];
  }[];
}

export interface GetAllProjectsResponse {
  success: boolean;
  message?: string;
  data: ProjectApiResponse[];
}

export const getAllProjects = async (): Promise<GetAllProjectsResponse> => {
  try {
    const response = await axiosClient.get('/projects/get-all');
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data as GetAllProjectsResponse;
    }
    throw error;
  }
};
