import axios, { AxiosResponse } from 'axios';
import { throttle } from 'lodash';

export interface foodParingPredictedResult {
    usual_paring: boolean;
    potentially_new_pairing: boolean;
}

export const throttledPredictPairing = throttle(async (food1_id: string, food2_id: string) => {
    const requestData = {
        food1_id,
        food2_id
    };
    try {
        const response = await axios.post('http://localhost:8000/predict/', requestData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return {
            usual_paring: response.data.usual_pairing,
            potentially_new_pairing: response.data.potentially_new_pairing
        };
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}, 200);