import { drizzle } from "drizzle-orm/neon-server";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema"; 

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
