import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { LocalStorageAdapter } from "../storage/LocalStorageAdapter";

export const useMigrationCheck = () => {
  const { authMode, user, loading } = useAuth();
  const [shouldShowMigration, setShouldShowMigration] = useState(false);

  useEffect(() => {
    if (loading) return;

    // Only check if user is in Firebase mode and authenticated
    if (authMode !== "firebase" || !user) {
      setShouldShowMigration(false);
      return;
    }

    // Check if migration was already done or skipped
    const migrationStatus = localStorage.getItem("fin2ools_data_migrated");
    if (migrationStatus === "true" || migrationStatus === "skipped") {
      setShouldShowMigration(false);
      return;
    }

    // Check if there's any actual data to migrate (my_funds or watchlist)
    const localAdapter = new LocalStorageAdapter();
    const localData = localAdapter.getAll();
    
    // Only check for actual data keys, not migration status flags
    const dataKeys = Object.keys(localData).filter(
      key => key === 'fin2ools_my_funds' || key === 'fin2ools_mf_watchlist'
    );
    const hasLocalData = dataKeys.length > 0;

    setShouldShowMigration(hasLocalData);
  }, [authMode, user, loading]);

  return { shouldShowMigration };
};
