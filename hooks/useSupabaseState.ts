// @ts-nocheck

"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

export function useSupabaseState(key: string, defaultValue: any) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<any>(null);
  const supabase = createClient();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoaded(true);
        return;
      }

      const { data } = await supabase
        .from("user_data")
        .select(key)
        .eq("id", user.id)
        .single();

      if (!cancelled && data && data[key]) {
        setValue(data[key]);
      }
      if (!cancelled) setLoaded(true);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!loaded) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from("user_data")
        .update({ [key]: value, updated_at: new Date().toISOString() })
        .eq("id", user.id);
    }, 500);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [value, loaded, key]);

  return [value, setValue, loaded];
}