import { Alert } from 'react-native';

const API_URL = 'https://toolsaks-cloud.prodapt.com/app/user/activeemployees';
// Basic Auth Credentials (toolsadmin:toolsAZadmin) -> Base64 encoded
const AUTH_HEADER = 'Basic dG9vbHNhZG1pbjp0b29sc0FaYWRtaW4=';

export const fetchActiveEmployees = async () => {
    try {
        const response = await fetch(API_URL, {
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
        return data;
    } catch (error) {
        console.error('Failed to fetch active employees:', error);
        throw error;
    }
};

export const fetchActiveCostCodes = async (employeeCode: string) => {
    try {
        const response = await fetch(`https://toolsaks-cloud.prodapt.com/app/live/rmg/getallactivecostcodefortravel/${employeeCode}`, {
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
        return data;
    } catch (error) {
        console.error('Failed to fetch cost codes:', error);
        throw error;
    }
};

export const fetchLocationId = async (email: string): Promise<[number, string]> => {
    // Extract username (part before @)
    const username = email.split('@')[0];
    console.log(`[LocationService] Starting fetch for: ${username}`);

    try {
        // Step 1: Get Location Name
        const nameUrl = `https://toolsaks-cloud.prodapt.com/app/live/revamp/helpdeskentity/employeedetailswithgradebyusername/${username}`;
        console.log(`[LocationService] Fetching Name URL: ${nameUrl}`);

        const nameResponse = await fetch(nameUrl, {
            method: 'GET',
            headers: {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/json',
            },
        });

        console.log(`[LocationService] Name Response: ${nameResponse.status}`);

        if (!nameResponse.ok) {
            throw new Error(`Location Name API Error: ${nameResponse.status}`);
        }

        const nameData = await nameResponse.json();
        console.log('[LocationService] Name Data:', JSON.stringify(nameData));

        // Response is a list -> nameData[0]
        const locationName = nameData[0]?.workLocation;

        if (!locationName) {
            throw new Error('Location Name not found in response');
        }
        console.log(`[LocationService] Found Location Name: ${locationName}`);

        // Step 2: Get Location ID (using 'helpdesk' path)
        const idUrl = `https://toolsaks-cloud.prodapt.com/app/live/revamp/helpdesk/getbylocationname/${locationName}`;
        console.log(`[LocationService] Fetching ID URL: ${idUrl}`);

        const idResponse = await fetch(idUrl, {
            method: 'GET',
            headers: {
                'Authorization': AUTH_HEADER,
                'Content-Type': 'application/json',
            },
        });

        console.log(`[LocationService] ID Response: ${idResponse.status}`);

        if (!idResponse.ok) {
            throw new Error(`Location ID API Error: ${idResponse.status}`);
        }

        const idData = await idResponse.json();
        console.log('[LocationService] ID Data:', JSON.stringify(idData));

        const locationId = idData[0]?.locationId;
        console.log(`[LocationService] Found Location ID: ${locationId}`);

        return [locationId, locationName];

    } catch (error) {
        console.error('[LocationService] Failed to fetch location details:', error);
        throw error;
    }
};
