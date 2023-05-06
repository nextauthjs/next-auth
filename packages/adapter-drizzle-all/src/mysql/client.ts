import { drizzle } from "drizzle-orm/mysql2";
import mysql from 'mysql2/promise'


const poolConnection = mysql.createPool({})

export const db = drizzle(poolConnection);
