"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[7483],{3905:function(e,t,a){a.d(t,{Zo:function(){return p},kt:function(){return u}});var n=a(7294);function i(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function o(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){i(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function r(e,t){if(null==e)return{};var a,n,i=function(e,t){if(null==e)return{};var a,n,i={},s=Object.keys(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||(i[a]=e[a]);return i}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(n=0;n<s.length;n++)a=s[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(i[a]=e[a])}return i}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):o(o({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,i=e.mdxType,s=e.originalType,l=e.parentName,p=r(e,["components","mdxType","originalType","parentName"]),m=c(a),u=i,h=m["".concat(l,".").concat(u)]||m[u]||d[u]||s;return a?n.createElement(h,o(o({ref:t},p),{},{components:a})):n.createElement(h,o({ref:t},p))}));function u(e,t){var a=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var s=a.length,o=new Array(s);o[0]=m;var r={};for(var l in t)hasOwnProperty.call(t,l)&&(r[l]=t[l]);r.originalType=e,r.mdxType="string"==typeof e?e:i,o[1]=r;for(var c=2;c<s;c++)o[c]=a[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},4244:function(e,t,a){a.r(t),a.d(t,{frontMatter:function(){return r},contentTitle:function(){return l},metadata:function(){return c},toc:function(){return p},default:function(){return m}});var n=a(7462),i=a(3366),s=(a(7294),a(3905)),o=["components"],r={id:"callbacks",title:"Callbacks"},l=void 0,c={unversionedId:"configuration/callbacks",id:"version-v3/configuration/callbacks",isDocsHomePage:!1,title:"Callbacks",description:"Callbacks are asynchronous functions you can use to control what happens when an action is performed.",source:"@site/versioned_docs/version-v3/configuration/callbacks.md",sourceDirName:"configuration",slug:"/configuration/callbacks",permalink:"/v3/configuration/callbacks",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/configuration/callbacks.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"callbacks",title:"Callbacks"},sidebar:"version-v3/docs",previous:{title:"Pages",permalink:"/v3/configuration/pages"},next:{title:"Events",permalink:"/v3/configuration/events"}},p=[{value:"Sign in callback",id:"sign-in-callback",children:[],level:2},{value:"Redirect callback",id:"redirect-callback",children:[],level:2},{value:"JWT callback",id:"jwt-callback",children:[],level:2},{value:"Session callback",id:"session-callback",children:[],level:2}],d={toc:p};function m(e){var t=e.components,a=(0,i.Z)(e,o);return(0,s.kt)("wrapper",(0,n.Z)({},d,a,{components:t,mdxType:"MDXLayout"}),(0,s.kt)("p",null,"Callbacks are ",(0,s.kt)("strong",{parentName:"p"},"asynchronous")," functions you can use to control what happens when an action is performed."),(0,s.kt)("p",null,"Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs."),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"If you want to pass data such as an Access Token or User ID to the browser when using JSON Web Tokens, you can persist the data in the token when the ",(0,s.kt)("inlineCode",{parentName:"p"},"jwt")," callback is called, then pass the data through to the browser in the ",(0,s.kt)("inlineCode",{parentName:"p"},"session")," callback."))),(0,s.kt)("p",null,"You can specify a handler for any of the callbacks below."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"...\n  callbacks: {\n    async signIn(user, account, profile) {\n      return true\n    },\n    async redirect(url, baseUrl) {\n      return baseUrl\n    },\n    async session(session, user) {\n      return session\n    },\n    async jwt(token, user, account, profile, isNewUser) {\n      return token\n    }\n...\n}\n")),(0,s.kt)("p",null,"The documentation below shows how to implement each callback, their default behaviour and an example of what the response for each callback should be. Note that configuration options and authentication providers you are using can impact the values passed to the callbacks."),(0,s.kt)("h2",{id:"sign-in-callback"},"Sign in callback"),(0,s.kt)("p",null,"Use the ",(0,s.kt)("inlineCode",{parentName:"p"},"signIn()")," callback to control if a user is allowed to sign in."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"...\ncallbacks: {\n  /**\n   * @param  {object} user     User object\n   * @param  {object} account  Provider account\n   * @param  {object} profile  Provider profile\n   * @return {boolean|string}  Return `true` to allow sign in\n   *                           Return `false` to deny access\n   *                           Return `string` to redirect to (eg.: \"/unauthorized\")\n   */\n  async signIn(user, account, profile) {\n    const isAllowedToSignIn = true\n    if (isAllowedToSignIn) {\n      return true\n    } else {\n      // Return false to display a default error message\n      return false\n      // Or you can return a URL to redirect to:\n      // return '/unauthorized'\n    }\n  }\n}\n...\n")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"When using the ",(0,s.kt)("strong",{parentName:"p"},"Email Provider")," the ",(0,s.kt)("inlineCode",{parentName:"p"},"signIn()")," callback is triggered both when the user makes a ",(0,s.kt)("strong",{parentName:"p"},"Verification Request")," (before they are sent email with a link that will allow them to sign in) and again ",(0,s.kt)("em",{parentName:"p"},"after")," they activate the link in the sign in email."),(0,s.kt)("p",{parentName:"li"},"Email accounts do not have profiles in the same way OAuth accounts do. On the first call during email sign in the ",(0,s.kt)("inlineCode",{parentName:"p"},"profile")," object will include a property ",(0,s.kt)("inlineCode",{parentName:"p"},"verificationRequest: true")," to indicate it is being triggered in the verification request flow. When the callback is invoked ",(0,s.kt)("em",{parentName:"p"},"after")," a user has clicked on a sign in link, this property will not be present."),(0,s.kt)("p",{parentName:"li"},"You can check for the ",(0,s.kt)("inlineCode",{parentName:"p"},"verificationRequest")," property to avoid sending emails to addresses or domains on a blocklist (or to only explicitly generate them for email address in an allow list).")),(0,s.kt)("li",{parentName:"ul"},(0,s.kt)("p",{parentName:"li"},"When using the ",(0,s.kt)("strong",{parentName:"p"},"Credentials Provider")," the ",(0,s.kt)("inlineCode",{parentName:"p"},"user")," object is the response returned from the ",(0,s.kt)("inlineCode",{parentName:"p"},"authorization")," callback and the ",(0,s.kt)("inlineCode",{parentName:"p"},"profile")," object is the raw body of the ",(0,s.kt)("inlineCode",{parentName:"p"},"HTTP POST")," submission."))),(0,s.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"When using NextAuth.js with a database, the User object will be either a user object from the database (including the User ID) if the user has signed in before or a simpler prototype user object (i.e. name, email, image) for users who have not signed in before."),(0,s.kt)("p",{parentName:"div"},"When using NextAuth.js without a database, the user object it will always be a prototype user object, with information extracted from the profile."))),(0,s.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"Redirects returned by this callback cancel the authentication flow. Only redirect to error pages that, for example, tell the user why they're not allowed to sign in."),(0,s.kt)("p",{parentName:"div"},"To redirect to a page after a successful sign in, please use ",(0,s.kt)("a",{parentName:"p",href:"/getting-started/client#specifying-a-callbackurl"},"the ",(0,s.kt)("inlineCode",{parentName:"a"},"callbackUrl")," option")," or ",(0,s.kt)("a",{parentName:"p",href:"/configuration/callbacks#redirect-callback"},"the redirect callback"),"."))),(0,s.kt)("h2",{id:"redirect-callback"},"Redirect callback"),(0,s.kt)("p",null,"The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout)."),(0,s.kt)("p",null,"By default only URLs on the same URL as the site are allowed, you can use the redirect callback to customise that behaviour."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"...\ncallbacks: {\n  /**\n   * @param  {string} url      URL provided as callback URL by the client\n   * @param  {string} baseUrl  Default base URL of site (can be used as fallback)\n   * @return {string}          URL the client will be redirect to\n   */\n  async redirect(url, baseUrl) {\n    return url.startsWith(baseUrl)\n      ? url\n      : baseUrl\n  }\n}\n...\n")),(0,s.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"The redirect callback may be invoked more than once in the same flow."))),(0,s.kt)("h2",{id:"jwt-callback"},"JWT callback"),(0,s.kt)("p",null,"This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign\nin) or updated (i.e whenever a session is accessed in the client)."),(0,s.kt)("p",null,"e.g. ",(0,s.kt)("inlineCode",{parentName:"p"},"/api/auth/signin"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"getSession()"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"useSession()"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"/api/auth/session")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"As with database session expiry times, token expiry time is extended whenever a session is active."),(0,s.kt)("li",{parentName:"ul"},"The arguments ",(0,s.kt)("em",{parentName:"li"},"user"),", ",(0,s.kt)("em",{parentName:"li"},"account"),", ",(0,s.kt)("em",{parentName:"li"},"profile")," and ",(0,s.kt)("em",{parentName:"li"},"isNewUser")," are only passed the first time this callback is called on a new session, after the user signs in.")),(0,s.kt)("p",null,"The contents ",(0,s.kt)("em",{parentName:"p"},"user"),", ",(0,s.kt)("em",{parentName:"p"},"account"),", ",(0,s.kt)("em",{parentName:"p"},"profile")," and ",(0,s.kt)("em",{parentName:"p"},"isNewUser")," will vary depending on the provider and on if you are using a database or not. If you want to pass data such as User ID, OAuth Access Token, etc. to the browser, you can persist it in the token and use the ",(0,s.kt)("inlineCode",{parentName:"p"},"session()")," callback to return it."),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"...\ncallbacks: {\n  /**\n   * @param  {object}  token     Decrypted JSON Web Token\n   * @param  {object}  user      User object      (only available on sign in)\n   * @param  {object}  account   Provider account (only available on sign in)\n   * @param  {object}  profile   Provider profile (only available on sign in)\n   * @param  {boolean} isNewUser True if new user (only available on sign in)\n   * @return {object}            JSON Web Token that will be saved\n   */\n  async jwt(token, user, account, profile, isNewUser) {\n    // Add access_token to the token right after signin\n    if (account?.accessToken) {\n      token.accessToken = account.accessToken\n    }\n    return token\n  }\n}\n...\n")),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"Use an if branch in jwt with checking for existence of any other params than token. If any of those exist, you call jwt for the first time.\nThis is a good place to add for example an ",(0,s.kt)("inlineCode",{parentName:"p"},"access_token")," to your jwt, if you want to."))),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"Check out the content of all the params in addition ",(0,s.kt)("inlineCode",{parentName:"p"},"token"),", to see what info you have available on signin."))),(0,s.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"NextAuth.js does not limit how much data you can store in a JSON Web Token, however a ~",(0,s.kt)("strong",{parentName:"p"},"4096 byte limit")," per cookie is commonly imposed by browsers."),(0,s.kt)("p",{parentName:"div"},"If you need to persist a large amount of data, you will need to persist it elsewhere (e.g. in a database). A common solution is to store a key in the cookie that can be used to look up the remaining data in the database, for example, in the ",(0,s.kt)("inlineCode",{parentName:"p"},"session()")," callback."))),(0,s.kt)("h2",{id:"session-callback"},"Session callback"),(0,s.kt)("p",null,"The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token through the ",(0,s.kt)("inlineCode",{parentName:"p"},"jwt()")," callback, you have to explicitly forward it here to make it available to the client."),(0,s.kt)("p",null,"e.g. ",(0,s.kt)("inlineCode",{parentName:"p"},"getSession()"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"useSession()"),", ",(0,s.kt)("inlineCode",{parentName:"p"},"/api/auth/session")),(0,s.kt)("ul",null,(0,s.kt)("li",{parentName:"ul"},"When using database sessions, the User object is passed as an argument."),(0,s.kt)("li",{parentName:"ul"},"When using JSON Web Tokens for sessions, the JWT payload is provided instead.")),(0,s.kt)("pre",null,(0,s.kt)("code",{parentName:"pre",className:"language-js",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},"...\ncallbacks: {\n  /**\n   * @param  {object} session      Session object\n   * @param  {object} token        User object    (if using database sessions)\n   *                               JSON Web Token (if not using database sessions)\n   * @return {object}              Session that will be returned to the client\n   */\n  async session(session, token) {\n    // Add property to session, like an access_token from a provider.\n    session.accessToken = token.accessToken\n    return session\n  }\n}\n...\n")),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"When using JSON Web Tokens the ",(0,s.kt)("inlineCode",{parentName:"p"},"jwt()")," callback is invoked before the ",(0,s.kt)("inlineCode",{parentName:"p"},"session()")," callback, so anything you add to the\nJSON Web Token will be immediately available in the session callback, like for example an ",(0,s.kt)("inlineCode",{parentName:"p"},"access_token")," from a provider."))),(0,s.kt)("div",{className:"admonition admonition-tip alert alert--success"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.5 0C3.48 0 1 2.19 1 5c0 .92.55 2.25 1 3 1.34 2.25 1.78 2.78 2 4v1h5v-1c.22-1.22.66-1.75 2-4 .45-.75 1-2.08 1-3 0-2.81-2.48-5-5.5-5zm3.64 7.48c-.25.44-.47.8-.67 1.11-.86 1.41-1.25 2.06-1.45 3.23-.02.05-.02.11-.02.17H5c0-.06 0-.13-.02-.17-.2-1.17-.59-1.83-1.45-3.23-.2-.31-.42-.67-.67-1.11C2.44 6.78 2 5.65 2 5c0-2.2 2.02-4 4.5-4 1.22 0 2.36.42 3.22 1.19C10.55 2.94 11 3.94 11 5c0 .66-.44 1.78-.86 2.48zM4 14h5c-.23 1.14-1.3 2-2.5 2s-2.27-.86-2.5-2z"}))),"tip")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"To better represent its value, when using a JWT session, the second parameter should be called ",(0,s.kt)("inlineCode",{parentName:"p"},"token")," (This is the same thing you return from the ",(0,s.kt)("inlineCode",{parentName:"p"},"jwt()")," callback). If you use a database, call it ",(0,s.kt)("inlineCode",{parentName:"p"},"user"),"."))),(0,s.kt)("div",{className:"admonition admonition-warning alert alert--danger"},(0,s.kt)("div",{parentName:"div",className:"admonition-heading"},(0,s.kt)("h5",{parentName:"div"},(0,s.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,s.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"12",height:"16",viewBox:"0 0 12 16"},(0,s.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M5.05.31c.81 2.17.41 3.38-.52 4.31C3.55 5.67 1.98 6.45.9 7.98c-1.45 2.05-1.7 6.53 3.53 7.7-2.2-1.16-2.67-4.52-.3-6.61-.61 2.03.53 3.33 1.94 2.86 1.39-.47 2.3.53 2.27 1.67-.02.78-.31 1.44-1.13 1.81 3.42-.59 4.78-3.42 4.78-5.56 0-2.84-2.53-3.22-1.25-5.61-1.52.13-2.03 1.13-1.89 2.75.09 1.08-1.02 1.8-1.86 1.33-.67-.41-.66-1.19-.06-1.78C8.18 5.31 8.68 2.45 5.05.32L5.03.3l.02.01z"}))),"warning")),(0,s.kt)("div",{parentName:"div",className:"admonition-content"},(0,s.kt)("p",{parentName:"div"},"The session object is not persisted server side, even when using database sessions - only data such as the session token, the user, and the expiry time is stored in the session table."),(0,s.kt)("p",{parentName:"div"},"If you need to persist session data server side, you can use the ",(0,s.kt)("inlineCode",{parentName:"p"},"accessToken")," returned for the session as a key - and connect to the database in the ",(0,s.kt)("inlineCode",{parentName:"p"},"session()")," callback to access it. Session ",(0,s.kt)("inlineCode",{parentName:"p"},"accessToken")," values do not rotate and are valid as long as the session is valid."),(0,s.kt)("p",{parentName:"div"},"If using JSON Web Tokens instead of database sessions, you should use the User ID or a unique key stored in the token (you will need to generate a key for this yourself on sign in, as access tokens for sessions are not generated when using JSON Web Tokens)."))))}m.isMDXComponent=!0}}]);