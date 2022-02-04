"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[6239],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return v}});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},p=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),p=u(n),v=o,h=p["".concat(l,".").concat(v)]||p[v]||d[v]||i;return n?r.createElement(h,a(a({ref:t},c),{},{components:n})):r.createElement(h,a({ref:t},c))}));function v(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,a[1]=s;for(var u=2;u<i;u++)a[u]=n[u];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}p.displayName="MDXCreateElement"},1621:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return l},metadata:function(){return u},toc:function(){return c},default:function(){return p}});var r=n(7462),o=n(3366),i=(n(7294),n(3905)),a=["components"],s={id:"events",title:"Events"},l=void 0,u={unversionedId:"configuration/events",id:"version-v3/configuration/events",isDocsHomePage:!1,title:"Events",description:"Events are asynchronous functions that do not return a response, they are useful for audit logs / reporting.",source:"@site/versioned_docs/version-v3/configuration/events.md",sourceDirName:"configuration",slug:"/configuration/events",permalink:"/v3/configuration/events",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/configuration/events.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"events",title:"Events"},sidebar:"version-v3/docs",previous:{title:"Callbacks",permalink:"/v3/configuration/callbacks"},next:{title:"Overview",permalink:"/v3/adapters/overview"}},c=[{value:"Events",id:"events",children:[{value:"signIn",id:"signin",children:[],level:3},{value:"signOut",id:"signout",children:[],level:3},{value:"createUser",id:"createuser",children:[],level:3},{value:"updateUser",id:"updateuser",children:[],level:3},{value:"linkAccount",id:"linkaccount",children:[],level:3},{value:"session",id:"session",children:[],level:3},{value:"error",id:"error",children:[],level:3}],level:2}],d={toc:c};function p(e){var t=e.components,n=(0,o.Z)(e,a);return(0,i.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("p",null,"Events are asynchronous functions that do not return a response, they are useful for audit logs / reporting."),(0,i.kt)("p",null,"You can specify a handler for any of these events below, for debugging or for an audit log."),(0,i.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,i.kt)("div",{parentName:"div",className:"admonition-heading"},(0,i.kt)("h5",{parentName:"div"},(0,i.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,i.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,i.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,i.kt)("div",{parentName:"div",className:"admonition-content"},(0,i.kt)("p",{parentName:"div"},"Execution of your auth API will be blocked by an ",(0,i.kt)("inlineCode",{parentName:"p"},"await")," on your event handler. If your event handler starts any burdensome work it should not block its own promise on that work."))),(0,i.kt)("h2",{id:"events"},"Events"),(0,i.kt)("h3",{id:"signin"},"signIn"),(0,i.kt)("p",null,"Sent on successful sign in."),(0,i.kt)("p",null,"The message will be an object and contain:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"user")," (from your adapter or from the provider if a ",(0,i.kt)("inlineCode",{parentName:"li"},"credentials")," type provider)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"account")," (from your adapter or the provider)"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"isNewUser")," (whether your adapter had a user for this account already)")),(0,i.kt)("h3",{id:"signout"},"signOut"),(0,i.kt)("p",null,"Sent when the user signs out."),(0,i.kt)("p",null,"The message object is the JWT, if using them, or the adapter session object for the session that is being ended."),(0,i.kt)("h3",{id:"createuser"},"createUser"),(0,i.kt)("p",null,"Sent when the adapter is told to create a new user."),(0,i.kt)("p",null,"The message object will be the user."),(0,i.kt)("h3",{id:"updateuser"},"updateUser"),(0,i.kt)("p",null,"Sent when the adapter is told to update an existing user. Currently this is only sent when the user verifies their email address."),(0,i.kt)("p",null,"The message object will be the user."),(0,i.kt)("h3",{id:"linkaccount"},"linkAccount"),(0,i.kt)("p",null,"Sent when an account in a given provider is linked to a user in our userbase. For example, when a user signs up with Twitter or when an existing user links their Google account."),(0,i.kt)("p",null,"The message will be an object and contain:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"user"),": The user object from your adapter"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"providerAccount"),": The object returned from the provider.")),(0,i.kt)("h3",{id:"session"},"session"),(0,i.kt)("p",null,"Sent at the end of a request for the current session."),(0,i.kt)("p",null,"The message will be an object and contain:"),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"session"),": The session object from your adapter"),(0,i.kt)("li",{parentName:"ul"},(0,i.kt)("inlineCode",{parentName:"li"},"jwt"),": If using JWT, the token for this session.")),(0,i.kt)("h3",{id:"error"},"error"),(0,i.kt)("p",null,"Sent when an error occurs"),(0,i.kt)("p",null,"The message could be any object relevant to describing the error."))}p.isMDXComponent=!0}}]);