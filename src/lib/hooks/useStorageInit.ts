import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { storageService } from "../storage";

export const useStorageInit = () => {
  const { authMode, user, loading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for auth to finish loading
    if (loading) {
      setIsReady(false);
      return;
    }

    if (authMode === "firebase" && user) {
      storageService.setMode("firebase", user.uid);
    } else {
      storageService.setMode("local");
    }

    setIsReady(true);
  }, [authMode, user, loading]);

  return { isReady };
};
