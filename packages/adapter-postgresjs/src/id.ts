import { customAlphabet } from "nanoid/non-secure"
//or
//import { customAlphabet as secureAlphabet } from "nanoid"
/**
 * @param range URL-safe by default but easily extended.
 */
const range = "+-¥∑µ§†ƒ0123456789abcdefghijklmnopqrstuvwxyz"
/**
 * @param size default size = 21
 */
const size = 5
/**
 * PROS: Fast-Compact-Customizable!
 * CONS: Less secure
 */
export const nanoid = customAlphabet(range, size)

/**
 * PROS: Lower collision probability and higher security
 * CONS: Less secure */
//export const nanoid = secureAlphabet(range, 5)
