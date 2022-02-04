"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[3123],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return h}});var i=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=i.createContext({}),l=function(e){var t=i.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=l(e.components);return i.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return i.createElement(i.Fragment,{},t)}},d=i.forwardRef((function(e,t){var n=e.components,a=e.mdxType,r=e.originalType,p=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=l(n),h=a,g=d["".concat(p,".").concat(h)]||d[h]||c[h]||r;return n?i.createElement(g,o(o({ref:t},u),{},{components:n})):i.createElement(g,o({ref:t},u))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var r=n.length,o=new Array(r);o[0]=d;var s={};for(var p in t)hasOwnProperty.call(t,p)&&(s[p]=t[p]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var l=2;l<r;l++)o[l]=n[l];return i.createElement.apply(null,o)}return i.createElement.apply(null,n)}d.displayName="MDXCreateElement"},4128:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return p},metadata:function(){return l},toc:function(){return u},default:function(){return d}});var i=n(7462),a=n(3366),r=(n(7294),n(3905)),o=["components"],s={id:"rest-api",title:"REST API"},p=void 0,l={unversionedId:"getting-started/rest-api",id:"getting-started/rest-api",isDocsHomePage:!1,title:"REST API",description:"NextAuth.js exposes a REST API that is used by the NextAuth.js client.",source:"@site/docs/getting-started/rest-api.md",sourceDirName:"getting-started",slug:"/getting-started/rest-api",permalink:"/getting-started/rest-api",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/getting-started/rest-api.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"rest-api",title:"REST API"},sidebar:"docs",previous:{title:"Client API",permalink:"/getting-started/client"},next:{title:"TypeScript",permalink:"/getting-started/typescript"}},u=[{value:"<code>GET</code> /api/auth/signin",id:"get-apiauthsignin",children:[],level:4},{value:"<code>POST</code> /api/auth/signin/:provider",id:"post-apiauthsigninprovider",children:[],level:4},{value:"<code>GET</code>/<code>POST</code> /api/auth/callback/:provider",id:"getpost-apiauthcallbackprovider",children:[],level:4},{value:"<code>GET</code> /api/auth/signout",id:"get-apiauthsignout",children:[],level:4},{value:"<code>POST</code> /api/auth/signout",id:"post-apiauthsignout",children:[],level:4},{value:"<code>GET</code> /api/auth/session",id:"get-apiauthsession",children:[],level:4},{value:"<code>GET</code> /api/auth/csrf",id:"get-apiauthcsrf",children:[],level:4},{value:"<code>GET</code> /api/auth/providers",id:"get-apiauthproviders",children:[],level:4}],c={toc:u};function d(e){var t=e.components,n=(0,a.Z)(e,o);return(0,r.kt)("wrapper",(0,i.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"NextAuth.js exposes a REST API that is used by the NextAuth.js client."),(0,r.kt)("h4",{id:"get-apiauthsignin"},(0,r.kt)("inlineCode",{parentName:"h4"},"GET")," /api/auth/signin"),(0,r.kt)("p",null,"Displays the built-in/unbranded sign-in page."),(0,r.kt)("h4",{id:"post-apiauthsigninprovider"},(0,r.kt)("inlineCode",{parentName:"h4"},"POST")," /api/auth/signin/:provider"),(0,r.kt)("p",null,"Starts a provider-specific sign-in flow."),(0,r.kt)("p",null,"The POST submission requires CSRF token from ",(0,r.kt)("inlineCode",{parentName:"p"},"/api/auth/csrf"),"."),(0,r.kt)("p",null,"In case of an OAuth provider, calling this endpoint will initiate the Authorization Request to your Identity Provider.\nLearn more about this in the ",(0,r.kt)("a",{parentName:"p",href:"https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1"},"OAuth specification"),"."),(0,r.kt)("p",null,"In case of using the Email provider, calling this endpoint will send a sign-in URL to the user's e-mail address."),(0,r.kt)("p",null,"This endpoint is also used by the ",(0,r.kt)("a",{parentName:"p",href:"/getting-started/client#signin"},(0,r.kt)("inlineCode",{parentName:"a"},"signIn"))," method internally."),(0,r.kt)("h4",{id:"getpost-apiauthcallbackprovider"},(0,r.kt)("inlineCode",{parentName:"h4"},"GET"),"/",(0,r.kt)("inlineCode",{parentName:"h4"},"POST")," /api/auth/callback/:provider"),(0,r.kt)("p",null,"Handles returning requests from OAuth services during sign-in."),(0,r.kt)("p",null,"For OAuth 2.0 providers that support the ",(0,r.kt)("inlineCode",{parentName:"p"},'checks: ["state"]')," option, the state parameter is checked against the one that was generated when the sign in flow was started - this uses a hash of the CSRF token which MUST match for both the ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"GET")," calls during sign-in."),(0,r.kt)("p",null,"Learn more about this in the ",(0,r.kt)("a",{parentName:"p",href:"https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.2"},"OAuth specification"),"."),(0,r.kt)("h4",{id:"get-apiauthsignout"},(0,r.kt)("inlineCode",{parentName:"h4"},"GET")," /api/auth/signout"),(0,r.kt)("p",null,"Displays the built-in/unbranded sign out page."),(0,r.kt)("h4",{id:"post-apiauthsignout"},(0,r.kt)("inlineCode",{parentName:"h4"},"POST")," /api/auth/signout"),(0,r.kt)("p",null,"Handles signing the user out - this is a ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," submission to prevent malicious links from triggering signing a user out without their consent. The user session will be invalidated/removed from the cookie/database, depending on the flow you chose to ",(0,r.kt)("a",{parentName:"p",href:"/configuration/options#session"},"store sessions"),"."),(0,r.kt)("p",null,"The ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," submission requires CSRF token from ",(0,r.kt)("inlineCode",{parentName:"p"},"/api/auth/csrf"),"."),(0,r.kt)("p",null,"This endpoint is also used by the ",(0,r.kt)("a",{parentName:"p",href:"/getting-started/client#signout"},(0,r.kt)("inlineCode",{parentName:"a"},"signOut"))," method internally."),(0,r.kt)("h4",{id:"get-apiauthsession"},(0,r.kt)("inlineCode",{parentName:"h4"},"GET")," /api/auth/session"),(0,r.kt)("p",null,"Returns client-safe session object - or an empty object if there is no session."),(0,r.kt)("p",null,"The contents of the session object that is returned are configurable with the ",(0,r.kt)("a",{parentName:"p",href:"/configuration/callbacks#session-callback"},(0,r.kt)("inlineCode",{parentName:"a"},"session")," callback"),"."),(0,r.kt)("h4",{id:"get-apiauthcsrf"},(0,r.kt)("inlineCode",{parentName:"h4"},"GET")," /api/auth/csrf"),(0,r.kt)("p",null,'Returns object containing CSRF token. In NextAuth.js, CSRF protection is present on all authentication routes. It uses the "double submit cookie method", which uses a signed HttpOnly, host-only cookie.'),(0,r.kt)("p",null,"The CSRF token returned by this endpoint must be passed as form variable named ",(0,r.kt)("inlineCode",{parentName:"p"},"csrfToken")," in all ",(0,r.kt)("inlineCode",{parentName:"p"},"POST")," submissions to any API endpoint."),(0,r.kt)("h4",{id:"get-apiauthproviders"},(0,r.kt)("inlineCode",{parentName:"h4"},"GET")," /api/auth/providers"),(0,r.kt)("p",null,"Returns a list of configured OAuth services and details (e.g. sign in and callback URLs) for each service."),(0,r.kt)("p",null,"It is useful to dynamically generate custom sign up pages and to check what callback URLs are configured for each OAuth provider that is configured."),(0,r.kt)("hr",null),(0,r.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,r.kt)("div",{parentName:"div",className:"admonition-heading"},(0,r.kt)("h5",{parentName:"div"},(0,r.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,r.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,r.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,r.kt)("div",{parentName:"div",className:"admonition-content"},(0,r.kt)("p",{parentName:"div"},"The default base path is ",(0,r.kt)("inlineCode",{parentName:"p"},"/api/auth")," but it is configurable by specifying a custom path in ",(0,r.kt)("inlineCode",{parentName:"p"},"NEXTAUTH_URL")),(0,r.kt)("p",{parentName:"div"},"e.g."),(0,r.kt)("p",{parentName:"div"},(0,r.kt)("inlineCode",{parentName:"p"},"NEXTAUTH_URL=https://example.com/myapp/api/authentication")),(0,r.kt)("p",{parentName:"div"},(0,r.kt)("inlineCode",{parentName:"p"},"/api/auth/signin")," -> ",(0,r.kt)("inlineCode",{parentName:"p"},"/myapp/api/authentication/signin")))))}d.isMDXComponent=!0}}]);