import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

const supabase = createClient<Database>(
  "https://aekbyvvqvfkyowejszpb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFla2J5dnZxdmZreW93ZWpzenBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxODY5NzQsImV4cCI6MjA1OTc2Mjk3NH0.8AZUl0l0smpYaVL6T2bwnEtM2ggkGsK4nrWhu881Fb8",
);

export default supabase;
