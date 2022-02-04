"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[4532],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return h}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},c=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),u=p(n),h=a,m=u["".concat(l,".").concat(h)]||u[h]||d[h]||i;return n?r.createElement(m,o(o({ref:t},c),{},{components:n})):r.createElement(m,o({ref:t},c))}));function h(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=n.length,o=new Array(i);o[0]=u;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:a,o[1]=s;for(var p=2;p<i;p++)o[p]=n[p];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},9209:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return c},default:function(){return u}});var r=n(7462),a=n(3366),i=(n(7294),n(3905)),o=["components"],s={id:"warnings",title:"Warnings"},l=void 0,p={unversionedId:"warnings",id:"warnings",isDocsHomePage:!1,title:"Warnings",description:"This is a list of warning output from NextAuth.js.",source:"@site/docs/warnings.md",sourceDirName:".",slug:"/warnings",permalink:"/warnings",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/warnings.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"warnings",title:"Warnings"},sidebar:"docs",previous:{title:"Upstash Redis",permalink:"/adapters/upstash-redis"},next:{title:"Errors",permalink:"/errors"}},c=[{value:"Client",id:"client",children:[{value:"NEXTAUTH_URL",id:"nextauth_url",children:[],level:4}],level:2},{value:"Server",id:"server",children:[{value:"NO_SECRET",id:"no_secret",children:[],level:4},{value:"TWITTER_OAUTH_2_BETA",id:"twitter_oauth_2_beta",children:[],level:4}],level:2},{value:"Adapter",id:"adapter",children:[{value:"ADAPTER_TYPEORM_UPDATING_ENTITIES",id:"adapter_typeorm_updating_entities",children:[],level:3}],level:2}],d={toc:c};function u(e){var t=e.components,n=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"This is a list of warning output from NextAuth.js."),(0,i.kt)("p",null,"All warnings indicate things which you should take a look at, but do not inhibit normal operation."),(0,i.kt)("hr",null),(0,i.kt)("h2",{id:"client"},"Client"),(0,i.kt)("h4",{id:"nextauth_url"},"NEXTAUTH_URL"),(0,i.kt)("p",null,"Environment variable ",(0,i.kt)("inlineCode",{parentName:"p"},"NEXTAUTH_URL")," missing. Please set it in your ",(0,i.kt)("inlineCode",{parentName:"p"},".env")," file."),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"On ",(0,i.kt)("a",{parentName:"p",href:"https://vercel.com"},"Vercel")," deployments, we will read the ",(0,i.kt)("inlineCode",{parentName:"p"},"VERCEL_URL")," environment variable, so you won't need to define ",(0,i.kt)("inlineCode",{parentName:"p"},"NEXTAUTH_URL"),"."))),(0,i.kt)("hr",null),(0,i.kt)("h2",{id:"server"},"Server"),(0,i.kt)("p",null,"These warnings are displayed on the terminal."),(0,i.kt)("h4",{id:"no_secret"},"NO_SECRET"),(0,i.kt)("p",null,"In development, we generate a ",(0,i.kt)("inlineCode",{parentName:"p"},"secret")," based on your configuration for convenience. This is volatile and will throw an error in production. ",(0,i.kt)("a",{parentName:"p",href:"https://next-auth.js.org/configuration/options#secret"},"Read more")),(0,i.kt)("h4",{id:"twitter_oauth_2_beta"},"TWITTER_OAUTH_2_BETA"),(0,i.kt)("p",null,"Twitter OAuth 2.0 is currently in beta as certain changes might still be necessary. This is not covered by semver. See the docs ",(0,i.kt)("a",{parentName:"p",href:"https://next-auth.js.org/providers/twitter#oauth-2"},"https://next-auth.js.org/providers/twitter#oauth-2")),(0,i.kt)("h2",{id:"adapter"},"Adapter"),(0,i.kt)("h3",{id:"adapter_typeorm_updating_entities"},"ADAPTER_TYPEORM_UPDATING_ENTITIES"),(0,i.kt)("p",null,"This warning occurs when typeorm finds that the provided entities differ from the database entities. By default while not in ",(0,i.kt)("inlineCode",{parentName:"p"},"production")," the typeorm adapter will always synchronize changes made to the entities codefiles."),(0,i.kt)("p",null,"Disable this warning by setting ",(0,i.kt)("inlineCode",{parentName:"p"},"synchronize: false")," in your typeorm config"),(0,i.kt)("p",null,"Example:"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="/pages/api/auth/[...nextauth].js"',title:'"/pages/api/auth/[...nextauth].js"'},"adapter: TypeORMLegacyAdapter({\n  type: 'mysql',\n  username: process.env.DATABASE_USERNAME,\n  password: process.env.DATABASE_PASSWORD,\n  host: process.env.DATABASE_HOST,\n  database: process.env.DATABASE_DB,\n  synchronize: false\n}),\n")))}u.isMDXComponent=!0}}]);