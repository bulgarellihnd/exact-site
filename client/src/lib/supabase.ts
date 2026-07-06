import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://bvhgrzurigzzjtrnyknl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ2aGdyenVyaWd6emp0cm55a25sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODUwMzEsImV4cCI6MjA5NDM2MTAzMX0.uB6LUCUL8d4hCcMRJOdFM6DDLzmZ0eK2Bc6rH7A2qjI"
);