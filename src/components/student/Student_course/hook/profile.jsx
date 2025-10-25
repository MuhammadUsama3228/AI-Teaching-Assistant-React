// src/components/hooks/useProfile.js
import { useState, useEffect } from "react";
import api from '../../../../api.js'

const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/api/manage_profile/");
                setProfile(response.data);
            } catch (err) {
                setError("Failed to fetch user profile");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { profile, loading, error };
};

export default useProfile;
