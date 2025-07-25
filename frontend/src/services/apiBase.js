import axios from "axios";
import { api_url } from "../../config";

const instance = axios.create({
    baseURL: api_url,
    withCredentials: true,
});

export async function apiCall(method, url, data) {
    try {
        const res = await instance[method](url, data);
        // دعم كل أنواع الردود: إذا كان فيه data.data أعدها، وإلا أعد data مباشرة
        if (res.data && (Array.isArray(res.data.data) || typeof res.data.data === 'object')) {
            return res.data.data;
        }
        return res.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default instance;
