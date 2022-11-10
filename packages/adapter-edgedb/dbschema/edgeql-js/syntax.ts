import type {TypeSet, setToTsType} from "./typesystem";

export * from "./literal";
export * from "./path";
export * from "./set";
export * from "./cast";
export * from "./select";
export * from "./update";
export * from "./insert";
export * from "./group";
export * from "./collections";
export * from "./funcops";
export * from "./for";
export * from "./with";
export * from "./params";
export * from "./globals";
export * from "./detached";
export * from "./toEdgeQL";
export * from "./range";

export type $infer<A extends TypeSet> = setToTsType<A>;
