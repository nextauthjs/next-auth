/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.

// import mdx files
declare module '*.mdx' {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}

declare module '*.svg' {
  let SVGComponent: (props) => JSX.Element;
  export default SVGComponent;
}

type TODO = any
