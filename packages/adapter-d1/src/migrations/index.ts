import {up as upSQLStatements} from "./init";
// @ts-ignore
import { D1Database, D1PreparedStatement } from "@cloudflare/workers-types";
import type { BothDB } from "..";

/**
 * 
 * @param db 
 */
async function up(db: BothDB) {
    // run the migration
    upSQLStatements.forEach(async (sql)=>{
        try {
            console.log('applying db migration sql', sql)
            const res = await db.prepare(sql).run();
            console.log('migration result', res)
        } catch(e:any) {
            console.log(e.cause?.message, e.message)
        }
        
    })
}

export { up }