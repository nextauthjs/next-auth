"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[4062],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return h}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),d=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=d(e.components);return r.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=d(n),h=a,m=u["".concat(l,".").concat(h)]||u[h]||p[h]||i;return n?r.createElement(m,o(o({ref:t},c),{},{components:n})):r.createElement(m,o({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var d=2;d<i;d++)o[d]=n[d];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},602:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return d},toc:function(){return c},Image:function(){return p},default:function(){return h}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],s={id:"credentials",title:"Credentials"},l=void 0,d={unversionedId:"providers/credentials",id:"version-v3/providers/credentials",isDocsHomePage:!1,title:"Credentials",description:"Overview",source:"@site/versioned_docs/version-v3/providers/credentials.mdx",sourceDirName:"providers",slug:"/providers/credentials",permalink:"/v3/providers/credentials",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/providers/credentials.mdx",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"credentials",title:"Credentials"},sidebar:"version-v3/docs",previous:{title:"Coinbase",permalink:"/v3/providers/coinbase"},next:{title:"Discord",permalink:"/v3/providers/discord"}},c=[{value:"Overview",id:"overview",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2},{value:"Multiple providers",id:"multiple-providers",children:[{value:"Example code",id:"example-code",children:[],level:3},{value:"Example UI",id:"example-ui",children:[],level:3}],level:2}],p=function(e){e.children;var t=e.src,n=e.alt,r=void 0===n?"":n;return(0,i.kt)("div",{style:{padding:"0.2rem",width:"100%",display:"flex",justifyContent:"center"}},(0,i.kt)("img",{alt:r,src:t}))},u={toc:c,Image:p};function h(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h2",{id:"overview"},"Overview"),(0,i.kt)("p",null,"The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, domain, or two factor authentication or hardware device (e.g. YubiKey U2F / FIDO)."),(0,i.kt)("p",null,"It is intended to support use cases where you have an existing system you need to authenticate users against."),(0,i.kt)("p",null,"It comes with the constraint that users authenticated in this manner are not persisted in the database, and consequently that the Credentials provider can only be used if JSON Web Tokens are enabled for sessions."),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"The functionality provided for credentials based authentication is intentionally limited to discourage use of passwords due to the inherent security risks associated with them and the additional complexity associated with supporting usernames and passwords."))),(0,i.kt)("h2",{id:"options"},"Options"),(0,i.kt)("p",null,"The ",(0,i.kt)("strong",{parentName:"p"},"Credentials Provider")," comes with a set of default options:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/providers/credentials.js"},"Credentials Provider options"))),(0,i.kt)("p",null,"You can override any of the options to suit your own use case."),(0,i.kt)("h2",{id:"example"},"Example"),(0,i.kt)("p",null,"The Credentials provider is specified like other providers, except that you need to define a handler for ",(0,i.kt)("inlineCode",{parentName:"p"},"authorize()")," that accepts credentials submitted via HTTP POST as input and returns either:"),(0,i.kt)("ol",null,(0,i.kt)("li",{parentName:"ol"},"A ",(0,i.kt)("inlineCode",{parentName:"li"},"user")," object, which indicates the credentials are valid.")),(0,i.kt)("p",null,"If you return an object it will be persisted to the JSON Web Token and the user will be signed in, unless a custom ",(0,i.kt)("inlineCode",{parentName:"p"},"signIn()")," callback is configured that subsequently rejects it."),(0,i.kt)("ol",{start:2},(0,i.kt)("li",{parentName:"ol"},"Either ",(0,i.kt)("inlineCode",{parentName:"li"},"false")," or ",(0,i.kt)("inlineCode",{parentName:"li"},"null"),", which indicates failure.")),(0,i.kt)("p",null,"If you return ",(0,i.kt)("inlineCode",{parentName:"p"},"false")," or ",(0,i.kt)("inlineCode",{parentName:"p"},"null")," then an error will be displayed advising the user to check their details."),(0,i.kt)("ol",{start:3},(0,i.kt)("li",{parentName:"ol"},"You can throw an Error or a URL (a string).")),(0,i.kt)("p",null,"If you throw an Error, the user will be sent to the error page with the error message as a query parameter. If throw a URL (a string), the user will be redirected to the URL."),(0,i.kt)("p",null,"The Credentials provider's ",(0,i.kt)("inlineCode",{parentName:"p"},"authorize()")," method also provides the request object as the second parameter (see example below)."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"import CredentialsProvider from 'next-auth/providers/credentials';\n...\nproviders: [\n  CredentialsProvider({\n    // The name to display on the sign in form (e.g. 'Sign in with...')\n    name: 'Credentials',\n    // The credentials is used to generate a suitable form on the sign in page.\n    // You can specify whatever fields you are expecting to be submitted.\n    // e.g. domain, username, password, 2FA token, etc.\n    credentials: {\n      username: { label: \"Username\", type: \"text\", placeholder: \"jsmith\" },\n      password: {  label: \"Password\", type: \"password\" }\n    },\n    async authorize(credentials, req) {\n      // Add logic here to look up the user from the credentials supplied\n      const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }\n\n      if (user) {\n        // Any object returned will be saved in `user` property of the JWT\n        return user\n      } else {\n        // If you return null or false then the credentials will be rejected\n        return null\n        // You can also Reject this callback with an Error or with a URL:\n        // throw new Error('error message') // Redirect to error page\n        // throw '/path/to/redirect'        // Redirect to a URL\n      }\n    }\n  })\n]\n...\n")),(0,i.kt)("p",null,"See the ",(0,i.kt)("a",{parentName:"p",href:"/configuration/callbacks"},"callbacks documentation")," for more information on how to interact with the token."),(0,i.kt)("h2",{id:"multiple-providers"},"Multiple providers"),(0,i.kt)("h3",{id:"example-code"},"Example code"),(0,i.kt)("p",null,"You can specify more than one credentials provider by specifying a unique ",(0,i.kt)("inlineCode",{parentName:"p"},"id")," for each one."),(0,i.kt)("p",null,"You can also use them in conjunction with other provider options."),(0,i.kt)("p",null,"As with all providers, the order you specify them is the order they are displayed on the sign in page."),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js"},'providers: [\n  Providers.Credentials({\n    id: "domain-login",\n    name: "Domain Account",\n    async authorize(credentials, req) {\n      const user = {\n        /* add function to get user */\n      }\n      return user\n    },\n    credentials: {\n      domain: {\n        label: "Domain",\n        type: "text ",\n        placeholder: "CORPNET",\n        value: "CORPNET",\n      },\n      username: { label: "Username", type: "text ", placeholder: "jsmith" },\n      password: { label: "Password", type: "password" },\n    },\n  }),\n  Providers.Credentials({\n    id: "intranet-credentials",\n    name: "Two Factor Auth",\n    async authorize(credentials, req) {\n      const user = {\n        /* add function to get user */\n      }\n      return user\n    },\n    credentials: {\n      email: { label: "Username", type: "text ", placeholder: "jsmith" },\n      "2fa-key": { label: "2FA Key" },\n    },\n  }),\n  /* ... additional providers ... /*/\n]\n')),(0,i.kt)("h3",{id:"example-ui"},"Example UI"),(0,i.kt)("p",null,"This example below shows a complex configuration is rendered by the built in sign in page."),(0,i.kt)("p",null,"You can also ",(0,i.kt)("a",{parentName:"p",href:"/configuration/pages#credentials-sign-in"},"use a custom sign in page")," if you want to provide a custom user experience."),(0,i.kt)(p,{src:"/img/signin-complex.png",mdxType:"Image"}))}h.isMDXComponent=!0}}]);