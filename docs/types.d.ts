declare module '*.mdx' {
  let MDXComponent: (props) => JSX.Element;
  export default MDXComponent;
}

declare module '*.svg' {
  let SVGComponent: (props) => JSX.Element;
  export default SVGComponent;
}

type TODO = any
