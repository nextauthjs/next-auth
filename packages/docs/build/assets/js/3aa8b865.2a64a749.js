"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[3882],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return u}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function d(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},i=Object.keys(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)n=i[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),s=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=s(e.components);return a.createElement(l.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,i=e.originalType,l=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),m=s(n),u=r,k=m["".concat(l,".").concat(u)]||m[u]||c[u]||i;return n?a.createElement(k,o(o({ref:t},p),{},{components:n})):a.createElement(k,o({ref:t},p))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=n.length,o=new Array(i);o[0]=m;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d.mdxType="string"==typeof e?e:r,o[1]=d;for(var s=2;s<i;s++)o[s]=n[s];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3204:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return l},contentTitle:function(){return s},metadata:function(){return p},toc:function(){return c},default:function(){return k}});var a,r=n(7462),i=n(3366),o=(n(7294),n(3905)),d=["components"],l={id:"providers",title:"Providers"},s=void 0,p={unversionedId:"configuration/providers",id:"version-v3/configuration/providers",isDocsHomePage:!1,title:"Providers",description:"Authentication Providers in NextAuth.js are services that can be used to sign in a user.",source:"@site/versioned_docs/version-v3/configuration/providers.md",sourceDirName:"configuration",slug:"/configuration/providers",permalink:"/v3/configuration/providers",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/configuration/providers.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"providers",title:"Providers"},sidebar:"version-v3/docs",previous:{title:"Options",permalink:"/v3/configuration/options"},next:{title:"Databases",permalink:"/v3/configuration/databases"}},c=[{value:"OAuth Providers",id:"oauth-providers",children:[{value:"Available providers",id:"available-providers",children:[],level:3},{value:"How to",id:"how-to",children:[],level:3},{value:"Options",id:"options",children:[],level:3},{value:"Using a custom provider",id:"using-a-custom-provider",children:[],level:3},{value:"Adding a new provider",id:"adding-a-new-provider",children:[],level:3}],level:2},{value:"Email Provider",id:"email-provider",children:[{value:"How to",id:"how-to-1",children:[],level:3},{value:"Options",id:"options-1",children:[],level:3}],level:2},{value:"Credentials Provider",id:"credentials-provider",children:[{value:"How to",id:"how-to-2",children:[],level:3},{value:"Options",id:"options-2",children:[],level:3}],level:2}],m=(a="Image",function(e){return console.warn("Component "+a+" was not imported, exported, or provided by MDXProvider as global scope"),(0,o.kt)("div",e)}),u={toc:c};function k(e){var t=e.components,a=(0,i.Z)(e,d);return(0,o.kt)("wrapper",(0,r.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Authentication Providers in ",(0,o.kt)("strong",{parentName:"p"},"NextAuth.js")," are services that can be used to sign in a user."),(0,o.kt)("p",null,"There's four ways a user can be signed in:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#oauth-providers"},"Using a built-in OAuth Provider")," (e.g Github, Twitter, Google, etc...)"),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#using-a-custom-provider"},"Using a custom OAuth Provider")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#email-provider"},"Using Email")),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"#credentials-provider"},"Using Credentials"))),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"NextAuth.js is designed to work with any OAuth service, it supports ",(0,o.kt)("strong",{parentName:"p"},"OAuth 1.0"),", ",(0,o.kt)("strong",{parentName:"p"},"1.0A")," and ",(0,o.kt)("strong",{parentName:"p"},"2.0")," and has built-in support for most popular sign-in services."))),(0,o.kt)("h2",{id:"oauth-providers"},"OAuth Providers"),(0,o.kt)("h3",{id:"available-providers"},"Available providers"),(0,o.kt)("div",{className:"provider-name-list"},Object.entries(n(3640)).filter((function(e){var t=e[0];return!["email","credentials"].includes(t)})).sort((function(e,t){var n=e[1],a=t[1];return n.localeCompare(a)})).map((function(e){var t=e[0],n=e[1];return(0,o.kt)("span",{key:t},(0,o.kt)("a",{href:"/providers/"+t},n),(0,o.kt)("span",{className:"provider-name-list__comma"},","))}))),(0,o.kt)("h3",{id:"how-to"},"How to"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"Register your application at the developer portal of your provider. There are links above to the developer docs for most supported providers with details on how to register your application.")),(0,o.kt)("li",{parentName:"ol"},(0,o.kt)("p",{parentName:"li"},"The redirect URI should follow this format:"))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"[origin]/api/auth/callback/[provider]\n")),(0,o.kt)("p",null,"For example, Twitter on ",(0,o.kt)("inlineCode",{parentName:"p"},"localhost")," this would be:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"http://localhost:3000/api/auth/callback/twitter\n")),(0,o.kt)("ol",{start:3},(0,o.kt)("li",{parentName:"ol"},"Create a ",(0,o.kt)("inlineCode",{parentName:"li"},".env")," file at the root of your project and add the client ID and client secret. For Twitter this would be:")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"TWITTER_ID=YOUR_TWITTER_CLIENT_ID\nTWITTER_SECRET=YOUR_TWITTER_CLIENT_SECRET\n")),(0,o.kt)("ol",{start:4},(0,o.kt)("li",{parentName:"ol"},"Now you can add the provider settings to the NextAuth options object. You can add as many OAuth providers as you like, as you can see ",(0,o.kt)("inlineCode",{parentName:"li"},"providers")," is an array.")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Twitter({\n    clientId: process.env.TWITTER_ID,\n    clientSecret: process.env.TWITTER_SECRET\n  })\n],\n...\n")),(0,o.kt)("ol",{start:5},(0,o.kt)("li",{parentName:"ol"},"Once a provider has been setup, you can sign in at the following URL: ",(0,o.kt)("inlineCode",{parentName:"li"},"[origin]/api/auth/signin"),". This is an unbranded auto-generated page with all the configured providers.")),(0,o.kt)(m,{src:"/img/signin.png",alt:"Signin Screenshot",mdxType:"Image"}),(0,o.kt)("h3",{id:"options"},"Options"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"Name"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Type"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Required"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"id"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Unique ID for the provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"name"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Descriptive name for the provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"type"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Type of provider, in this case ",(0,o.kt)("inlineCode",{parentName:"td"},"oauth")),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},'"oauth"')),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"version"),(0,o.kt)("td",{parentName:"tr",align:"center"},"OAuth version (e.g. '1.0', '1.0a', '2.0')"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"scope"),(0,o.kt)("td",{parentName:"tr",align:"center"},"OAuth access scopes (expects array or string)"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")," or ",(0,o.kt)("inlineCode",{parentName:"td"},"string[]")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"params"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Extra URL params sent when calling ",(0,o.kt)("inlineCode",{parentName:"td"},"accessTokenUrl")),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"Object")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"accessTokenUrl"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Endpoint to retrieve an access token"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"authorizationUrl"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Endpoint to request authorization from the user"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"requestTokenUrl"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Endpoint to retrieve a request token"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"profileUrl"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Endpoint to retrieve the user's profile"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"clientId"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Client ID of the OAuth provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"clientSecret"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Client Secret of the OAuth provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"profile"),(0,o.kt)("td",{parentName:"tr",align:"center"},"A callback returning an object with the user's info"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"(profile, tokens) => Object")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"protection"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Additional security for OAuth login flows (defaults to ",(0,o.kt)("inlineCode",{parentName:"td"},"state"),")"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},'"pkce"'),",",(0,o.kt)("inlineCode",{parentName:"td"},'"state"'),",",(0,o.kt)("inlineCode",{parentName:"td"},'"none"')),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"state"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Same as ",(0,o.kt)("inlineCode",{parentName:"td"},'protection: "state"'),". Being deprecated, use protection."),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"boolean")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"headers"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Any headers that should be sent to the OAuth provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"Object")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"authorizationParams"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Additional params to be sent to the authorization endpoint"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"Object")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"idToken"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Set to ",(0,o.kt)("inlineCode",{parentName:"td"},"true")," for services that use ID Tokens (e.g. OpenID)"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"boolean")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"region"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Only when using BattleNet"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"domain"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Only when using certain Providers"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"tenantId"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Only when using Azure, Active Directory, B2C, FusionAuth"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")))),(0,o.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Even if you are using a built-in provider, you can override any of these options to tweak the default configuration."),(0,o.kt)("pre",{parentName:"div"},(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:"title=[...nextauth].js",title:"[...nextauth].js"},'import Providers from "next-auth/providers"\n\nProviders.Auth0({\n  clientId: process.env.CLIENT_ID,\n  clientSecret: process.env.CLIENT_SECRET,\n  domain: process.env.DOMAIN,\n  scope: "openid your_custom_scope", // We do provide a default, but this will override it if defined\n  profile(profile) {\n    return {} // Return the profile in a shape that is different from the built-in one.\n  },\n})\n')))),(0,o.kt)("h3",{id:"using-a-custom-provider"},"Using a custom provider"),(0,o.kt)("p",null,"You can use an OAuth provider that isn't built-in by using a custom object."),(0,o.kt)("p",null,"As an example of what this looks like, this is the provider object returned for the Google provider:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},'{\n  id: "google",\n  name: "Google",\n  type: "oauth",\n  version: "2.0",\n  scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",\n  params: { grant_type: "authorization_code" },\n  accessTokenUrl: "https://accounts.google.com/o/oauth2/token",\n  requestTokenUrl: "https://accounts.google.com/o/oauth2/auth",\n  authorizationUrl: "https://accounts.google.com/o/oauth2/auth?response_type=code",\n  profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",\n  async profile(profile, tokens) {\n    // You can use the tokens, in case you want to fetch more profile information\n    // For example several OAuth providers do not return email by default.\n    // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`\n    return {\n      id: profile.id,\n      name: profile.name,\n      email: profile.email,\n      image: profile.picture\n    }\n  },\n  clientId: "",\n  clientSecret: ""\n}\n')),(0,o.kt)("p",null,"Replace all the options in this JSON object with the ones from your custom provider - be sure to give it a unique ID and specify the correct OAuth version - and add it to the providers option when initializing the library:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Twitter({\n    clientId: process.env.TWITTER_ID,\n    clientSecret: process.env.TWITTER_SECRET,\n  }),\n  {\n    id: 'customProvider',\n    name: 'CustomProvider',\n    type: 'oauth',\n    version: '2.0',\n    scope: ''  // Make sure to request the users email address\n    ...\n  }\n]\n...\n")),(0,o.kt)("h3",{id:"adding-a-new-provider"},"Adding a new provider"),(0,o.kt)("p",null,"If you think your custom provider might be useful to others, we encourage you to open a PR and add it to the built-in list so others can discover it much more easily!"),(0,o.kt)("p",null,"You only need to add two changes:"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Add your config: ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/tree/main/src/providers"},(0,o.kt)("inlineCode",{parentName:"a"},"src/providers/{provider}.js")),(0,o.kt)("br",null),"\n\u2022 make sure you use a named default export, like this: ",(0,o.kt)("inlineCode",{parentName:"li"},"export default function YourProvider")),(0,o.kt)("li",{parentName:"ol"},"Add provider documentation: ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/tree/ead715219a5d7a6e882a6ba27fa56b03954d062d/www/docs/providers"},(0,o.kt)("inlineCode",{parentName:"a"},"www/docs/providers/{provider}.md"))),(0,o.kt)("li",{parentName:"ol"},"Add it to our ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/types/providers.d.ts"},"provider types")," (for TS projects)",(0,o.kt)("br",null),"\n\u2022 you just need to add your new provider name to ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/types/providers.d.ts#L56-L97"},"this list"),(0,o.kt)("br",null),"\n\u2022 in case you new provider accepts some custom options, you can ",(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/types/providers.d.ts#L48-L53"},"add them here"))),(0,o.kt)("p",null,"That's it! \ud83c\udf89 Others will be able to discover this provider much more easily now!"),(0,o.kt)("h2",{id:"email-provider"},"Email Provider"),(0,o.kt)("h3",{id:"how-to-1"},"How to"),(0,o.kt)("p",null,'The Email provider uses email to send "magic links" that can be used sign in, you will likely have seen them before if you have used software like Slack.'),(0,o.kt)("p",null,"Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted)."),(0,o.kt)("p",null,"Configuration is similar to other providers, but the options are different:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Email({\n    server: process.env.EMAIL_SERVER,\n    from: process.env.EMAIL_FROM,\n    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)\n  }),\n],\n...\n")),(0,o.kt)("p",null,"See the ",(0,o.kt)("a",{parentName:"p",href:"/providers/email"},"Email provider documentation")," for more information on how to configure email sign in."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"The email provider requires a database, it cannot be used without one."))),(0,o.kt)("h3",{id:"options-1"},"Options"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"Name"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Type"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Required"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"id"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Unique ID for the provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"name"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Descriptive name for the provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"type"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Type of provider, in this case ",(0,o.kt)("inlineCode",{parentName:"td"},"email")),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},'"email"')),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"server"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Path or object pointing to the email server"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")," or ",(0,o.kt)("inlineCode",{parentName:"td"},"Object")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"sendVerificationRequest"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Callback to execute when a verification request is sent"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"(params) => Promise<undefined>")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"from"),(0,o.kt)("td",{parentName:"tr",align:"center"},'The email address from which emails are sent, default: "',(0,o.kt)("a",{parentName:"td",href:"mailto:no-reply@example.com"},"no-reply@example.com"),'"'),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"maxAge"),(0,o.kt)("td",{parentName:"tr",align:"center"},"How long until the e-mail can be used to log the user in seconds. Defaults to 1 day"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"number")),(0,o.kt)("td",{parentName:"tr",align:"center"},"No")))),(0,o.kt)("h2",{id:"credentials-provider"},"Credentials Provider"),(0,o.kt)("h3",{id:"how-to-2"},"How to"),(0,o.kt)("p",null,"The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, two factor authentication or hardware device (e.g. YubiKey U2F / FIDO)."),(0,o.kt)("p",null,"It is intended to support use cases where you have an existing system you need to authenticate users against."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},'import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Credentials({\n    // The name to display on the sign in form (e.g. \'Sign in with...\')\n    name: \'Credentials\',\n    // The credentials is used to generate a suitable form on the sign in page.\n    // You can specify whatever fields you are expecting to be submitted.\n    // e.g. domain, username, password, 2FA token, etc.\n    credentials: {\n      username: { label: "Username", type: "text", placeholder: "jsmith" },\n      password: {  label: "Password", type: "password" }\n    },\n    async authorize(credentials, req) {\n      // You need to provide your own logic here that takes the credentials\n      // submitted and returns either a object representing a user or value\n      // that is false/null if the credentials are invalid.\n      // e.g. return { id: 1, name: \'J Smith\', email: \'jsmith@example.com\' }\n      // You can also use the `req` object to obtain additional parameters\n      // (i.e., the request IP address)\n      const res = await fetch("/your/endpoint", {\n        method: \'POST\',\n        body: JSON.stringify(credentials),\n        headers: { "Content-Type": "application/json" }\n      })\n      const user = await res.json()\n\n      // If no error and we have user data, return it\n      if (res.ok && user) {\n        return user\n      }\n      // Return null if user data could not be retrieved\n      return null\n    }\n  })\n]\n...\n')),(0,o.kt)("p",null,"See the ",(0,o.kt)("a",{parentName:"p",href:"/providers/credentials"},"Credentials provider documentation")," for more information."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"The Credentials provider can only be used if JSON Web Tokens are enabled for sessions. Users authenticated with the Credentials provider are not persisted in the database."))),(0,o.kt)("h3",{id:"options-2"},"Options"),(0,o.kt)("table",null,(0,o.kt)("thead",{parentName:"table"},(0,o.kt)("tr",{parentName:"thead"},(0,o.kt)("th",{parentName:"tr",align:"center"},"Name"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Description"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Type"),(0,o.kt)("th",{parentName:"tr",align:"center"},"Required"))),(0,o.kt)("tbody",{parentName:"table"},(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"id"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Unique ID for the provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"name"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Descriptive name for the provider"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"string")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"type"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Type of provider, in this case ",(0,o.kt)("inlineCode",{parentName:"td"},"credentials")),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},'"credentials"')),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"credentials"),(0,o.kt)("td",{parentName:"tr",align:"center"},"The credentials to sign-in with"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"Object")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")),(0,o.kt)("tr",{parentName:"tbody"},(0,o.kt)("td",{parentName:"tr",align:"center"},"authorize"),(0,o.kt)("td",{parentName:"tr",align:"center"},"Callback to execute once user is to be authorized"),(0,o.kt)("td",{parentName:"tr",align:"center"},(0,o.kt)("inlineCode",{parentName:"td"},"(credentials, req) => Promise<User>")),(0,o.kt)("td",{parentName:"tr",align:"center"},"Yes")))))}k.isMDXComponent=!0},3640:function(e){e.exports=JSON.parse('{"42-school":"42 School","apple":"Apple","atlassian":"Atlassian","auth0":"Auth0","authentik":"Authentik","azure-ad-b2c":"Azure Active Directory B2C","azure-ad":"Azure Active Directory","battle.net":"Battle.net","box":"Box","bungie":"Bungie","cognito":"Amazon Cognito","coinbase":"Coinbase","credentials":"Credentials","discord":"Discord","dropbox":"Dropbox","email":"Email","eveonline":"EVE Online","facebook":"Facebook","faceit":"FACEIT","foursquare":"Foursquare","freshbooks":"Freshbooks","fusionauth":"FusionAuth","github":"GitHub","gitlab":"GitLab","google":"Google","identity-server4":"IdentityServer4","overview":"Overview","instagram":"Instagram","kakao":"Kakao","keycloak":"Keycloak","line":"LINE","linkedin":"LinkedIn","mailchimp":"Mailchimp","mailru":"Mail.ru","medium":"Medium","naver":"Naver","netlify":"Netlify","okta":"Okta","onelogin":"OneLogin","osso":"Osso","osu":"Osu!","patreon":"Patreon","pipedrive":"Pipedrive","reddit":"Reddit","salesforce":"Salesforce","slack":"Slack","spotify":"Spotify","strava":"Strava","trakt":"Trakt","twitch":"Twitch","twitter":"Twitter","vk":"VK","wordpress":"WordPress.com","workos":"WorkOS","yandex":"Yandex","zoho":"Zoho","zoom":"Zoom"}')}}]);