"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[633],{3905:function(e,t,n){n.d(t,{Zo:function(){return u},kt:function(){return d}});var r=n(7294);function i(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){i(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n,r,i={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(i[n]=e[n]);return i}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},s={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,i=e.mdxType,o=e.originalType,l=e.parentName,u=c(e,["components","mdxType","originalType","parentName"]),m=p(n),d=i,v=m["".concat(l,".").concat(d)]||m[d]||s[d]||o;return n?r.createElement(v,a(a({ref:t},u),{},{components:n})):r.createElement(v,a({ref:t},u))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var o=n.length,a=new Array(o);a[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:i,a[1]=c;for(var p=2;p<o;p++)a[p]=n[p];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},3694:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return c},contentTitle:function(){return l},metadata:function(){return p},toc:function(){return u},default:function(){return m}});var r=n(7462),i=n(3366),o=(n(7294),n(3905)),a=["components"],c={id:"mailchimp",title:"Mailchimp"},l=void 0,p={unversionedId:"providers/mailchimp",id:"version-v3/providers/mailchimp",isDocsHomePage:!1,title:"Mailchimp",description:"Documentation",source:"@site/versioned_docs/version-v3/providers/mailchimp.md",sourceDirName:"providers",slug:"/providers/mailchimp",permalink:"/v3/providers/mailchimp",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/providers/mailchimp.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"mailchimp",title:"Mailchimp"},sidebar:"version-v3/docs",previous:{title:"LinkedIn",permalink:"/v3/providers/linkedin"},next:{title:"Mail.ru",permalink:"/v3/providers/mailru"}},u=[{value:"Documentation",id:"documentation",children:[],level:2},{value:"Configuration",id:"configuration",children:[],level:2},{value:"Options",id:"options",children:[],level:2},{value:"Example",id:"example",children:[],level:2}],s={toc:u};function m(e){var t=e.components,n=(0,i.Z)(e,a);return(0,o.kt)("wrapper",(0,r.Z)({},s,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"documentation"},"Documentation"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/"},"https://mailchimp.com/developer/marketing/guides/access-user-data-oauth-2/")),(0,o.kt)("h2",{id:"configuration"},"Configuration"),(0,o.kt)("p",null,(0,o.kt)("a",{parentName:"p",href:"https://admin.mailchimp.com/account/oauth2/client/"},"https://admin.mailchimp.com/account/oauth2/client/")),(0,o.kt)("h2",{id:"options"},"Options"),(0,o.kt)("p",null,"The ",(0,o.kt)("strong",{parentName:"p"},"Mailchimp Provider")," comes with a set of default options:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("a",{parentName:"li",href:"https://github.com/nextauthjs/next-auth/blob/main/src/providers/mailchimp.js"},"Mailchimp Provider options"))),(0,o.kt)("p",null,"You can override any of the options to suit your own use case."),(0,o.kt)("h2",{id:"example"},"Example"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-js"},"import Providers from `next-auth/providers`\n...\nproviders: [\n  Providers.Mailchimp({\n    clientId: process.env.MAILCHIMP_CLIENT_ID,\n    clientSecret: process.env.MAILCHIMP_CLIENT_SECRET\n  })\n]\n...\n")))}m.isMDXComponent=!0}}]);