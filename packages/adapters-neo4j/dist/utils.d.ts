import neo4j from "neo4j-driver";
export declare const neo4jToSafeNumber: (x: typeof neo4j.Integer) => string | number | import("neo4j-driver-core/types/integer").default;
export declare const neo4jEpochToDate: (epoch: typeof neo4j.Integer) => Date | null;
