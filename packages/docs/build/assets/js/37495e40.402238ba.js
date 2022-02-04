"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[4346],{3905:function(e,t,a){a.d(t,{Zo:function(){return c},kt:function(){return u}});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var d=n.createContext({}),l=function(e){var t=n.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},c=function(e){var t=l(e.components);return n.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,o=e.originalType,d=e.parentName,c=r(e,["components","mdxType","originalType","parentName"]),m=l(a),u=i,h=m["".concat(d,".").concat(u)]||m[u]||p[u]||o;return a?n.createElement(h,s(s({ref:t},c),{},{components:a})):n.createElement(h,s({ref:t},c))}));function u(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=a.length,s=new Array(o);s[0]=m;var r={};for(var d in t)hasOwnProperty.call(t,d)&&(r[d]=t[d]);r.originalType=e,r.mdxType="string"==typeof e?e:i,s[1]=r;for(var l=2;l<o;l++)s[l]=a[l];return n.createElement.apply(null,s)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},8905:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return r},contentTitle:function(){return d},metadata:function(){return l},toc:function(){return c},default:function(){return m}});var n=a(7462),i=a(3366),o=(a(7294),a(3905)),s=["components"],r={id:"models",title:"Models"},d=void 0,l={unversionedId:"adapters/models",id:"adapters/models",isDocsHomePage:!1,title:"Models",description:"NextAuth.js can be used with any database. Models tell you what structures NextAuth.js expects from your database. Models will vary slightly depending on which adapter you use, but in general will look something like this.",source:"@site/docs/adapters/models.md",sourceDirName:"adapters",slug:"/adapters/models",permalink:"/adapters/models",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/adapters/models.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"models",title:"Models"},sidebar:"docs",previous:{title:"Overview",permalink:"/adapters/overview"},next:{title:"Prisma",permalink:"/adapters/prisma"}},c=[{value:"User",id:"user",children:[],level:2},{value:"Account",id:"account",children:[],level:2},{value:"Session",id:"session",children:[],level:2},{value:"Verification Token",id:"verification-token",children:[],level:2},{value:"RDBMS Naming Convention",id:"rdbms-naming-convention",children:[],level:2}],p={toc:c};function m(e){var t=e.components,r=(0,i.Z)(e,s);return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"NextAuth.js can be used with any database. Models tell you what structures NextAuth.js expects from your database. Models will vary slightly depending on which adapter you use, but in general will look something like this."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"v4 Schema",src:a(4056).Z})),(0,o.kt)("p",null,"More information about each Model / Table can be found below."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"You can ",(0,o.kt)("a",{parentName:"p",href:"/tutorials/creating-a-database-adapter"},"create your own adapter")," if you want to use NextAuth.js with a database that is not supported out of the box, or you have to change fields on any of the models."))),(0,o.kt)("hr",null),(0,o.kt)("h2",{id:"user"},"User"),(0,o.kt)("p",null,"The User model is for information such as the user's name and email address."),(0,o.kt)("p",null,"Email address is optional, but if one is specified for a User then it must be unique."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"If a user first signs in with OAuth then their email address is automatically populated using the one from their OAuth profile, if the OAuth provider returns one."),(0,o.kt)("p",{parentName:"div"},"This provides a way to contact users and for users to maintain access to their account and sign in using email in the event they are unable to sign in with the OAuth provider in future (if the ",(0,o.kt)("a",{parentName:"p",href:"/providers/email"},"Email Provider")," is configured)."))),(0,o.kt)("p",null,"User creation in the database is automatic, and happens when the user is logging in for the first time with a provider. The default data saved is ",(0,o.kt)("inlineCode",{parentName:"p"},"id"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"name"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"email")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"image"),". You can add more profile data by returning extra fields in your ",(0,o.kt)("a",{parentName:"p",href:"/configuration/providers/oauth#options"},"OAuth provider's ",(0,o.kt)("inlineCode",{parentName:"a"},"profile()"))," callback."),(0,o.kt)("h2",{id:"account"},"Account"),(0,o.kt)("p",null,"The Account model is for information about OAuth accounts associated with a User. It will usually contain ",(0,o.kt)("inlineCode",{parentName:"p"},"access_token"),", ",(0,o.kt)("inlineCode",{parentName:"p"},"id_token")," and other OAuth specific data. ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/panva/node-openid-client/blob/main/docs/README.md#new-tokensetinput"},(0,o.kt)("inlineCode",{parentName:"a"},"TokenSet"))," from ",(0,o.kt)("inlineCode",{parentName:"p"},"openid-client")," might give you an idea of all the fields."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"In case of an OAuth 1.0 provider (like Twitter), you will have to look for ",(0,o.kt)("inlineCode",{parentName:"p"},"oauth_token")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"oauth_token_secret")," string fields. GitHub also has an extra ",(0,o.kt)("inlineCode",{parentName:"p"},"refresh_token_expires_in")," integer field. You have to make sure that your database schema includes these fields."))),(0,o.kt)("p",null,"A single User can have multiple Accounts, but each Account can only have one User."),(0,o.kt)("p",null,"Linking Accounts to Users happen automatically, only when they have the same e-mail address, and the user is currently signed in. Check the ",(0,o.kt)("a",{parentName:"p",href:"/faq#security"},"FAQ")," for more information why this is a requirement."),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"You can manually unlink accounts, if your adapter implements the ",(0,o.kt)("inlineCode",{parentName:"p"},"unlinkAccount")," method. Make sure to take all the necessary security steps to avoid data loss."))),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Linking and unlinking accounts through an API is a planned feature: ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/nextauthjs/next-auth/issues/230"},"nextauthjs/next-auth#230")))),(0,o.kt)("h2",{id:"session"},"Session"),(0,o.kt)("p",null,"The Session model is used for database sessions. It is not used if JSON Web Tokens are enabled. Keep in mind, that you can use a database to persist Users and Accounts, and still use JWT for sessions. See the ",(0,o.kt)("a",{parentName:"p",href:"/configuration/options#session"},(0,o.kt)("inlineCode",{parentName:"a"},"session.strategy"))," option."),(0,o.kt)("p",null,"A single User can have multiple Sessions, each Session can only have one User."),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"When a Session is read, we check if it's ",(0,o.kt)("inlineCode",{parentName:"p"},"expires")," field indicates an invalid session, and delete it from the database. You can also do this clean-up periodically in the background to avoid our extra delete call to the database during an active session retrieval. This might result in a slight performance increase in a few cases."))),(0,o.kt)("h2",{id:"verification-token"},"Verification Token"),(0,o.kt)("p",null,"The Verification Token model is used to store tokens for passwordless sign in."),(0,o.kt)("p",null,"A single User can have multiple open Verification Tokens (e.g. to sign in to different devices)."),(0,o.kt)("p",null,"It has been designed to be extendable for other verification purposes in the future (e.g. 2FA / short codes)."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"NextAuth.js makes sure that every token is usable only once, and by default has a short (1 day, can be configured by ",(0,o.kt)("a",{parentName:"p",href:"/configuration/providers/email#options"},(0,o.kt)("inlineCode",{parentName:"a"},"maxAge")),") lifetime. If your user did not manage to finish the sign-in flow in time, they will have to start the sign-in process again."))),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Due to users forgetting or failing at the sign-in flow, you might end up with unwanted rows in your database, that you might have to periodically clean up to avoid filling the database up with unnecessary data."))),(0,o.kt)("h2",{id:"rdbms-naming-convention"},"RDBMS Naming Convention"),(0,o.kt)("p",null,'In the NextAuth.js v4 some schemas for the providers which support classic RDBMS type databases, like Prisma and TypeORM, have ended up with column names with mixed casing, i.e. snake_case and camelCase. If this is an issue for you or your underlying database system, please take a look at the "Naming Convention" section in the Prisma or TypeORM page.'))}m.isMDXComponent=!0},4056:function(e,t,a){t.Z=a.p+"assets/images/nextauth_v4_schema-9d6746cfdef30cb1a4c573edb0cc8070.png"}}]);