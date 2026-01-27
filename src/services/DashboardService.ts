
// Use 10.0.2.2 for Android Emulator to access localhost of the machine
const API_BASE_URL = 'http://10.0.2.2:8080';
// Basic Auth Credentials (testuser:eksDEVuser) -> Base64 encoded
const AUTH_HEADER = 'Basic dGVzdHVzZXI6ZWtzREVWdXNlcg==';

export interface TravelItem {
    // Define properties based on partial knowledge, expand as needed
    travel_id: string;
    // ... other fields
    [key: string]: any;
}

export interface ExpenseItem {
    travel_id: string;
    er_id: string;
    expense_name: string;
    submitted_amount: number;
    er_status: any;
    // ... other fields
    [key: string]: any;
}

export interface DashboardData {
    user_role: any; // specific type if known
    perdiem_accessbility: any;
    travel_items: TravelItem[];
    expense_items: ExpenseItem[];
}

export const fetchDashboardData = async (email: string): Promise<DashboardData> => {
    try {
        const response = await fetch(`${API_BASE_URL}/travelManagement/get_data/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as DashboardData;
    } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        throw error;
    }
};

export interface EmployeeEntity {
    Entity: string;
    Currency: string | null;
}

export const fetchUserEntity = async (email: string): Promise<EmployeeEntity> => {
    try {
        const response = await fetch(`${API_BASE_URL}/travelManagement/get_emp_entity/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as EmployeeEntity;
    } catch (error) {
        console.error('Failed to fetch employee entity:', error);
        throw error;
    }
};

export const fetchTravelIds = async (email: string): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/travelManagement/travel_ids/${email}`, {
            method: 'GET',
            headers: {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data as string[];
    } catch (error) {
        console.error('Failed to fetch travel IDs:', error);
        throw error;
    }
};


