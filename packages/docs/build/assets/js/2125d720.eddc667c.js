"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[7732],{3905:function(e,t,n){n.d(t,{Zo:function(){return c},kt:function(){return f}});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function u(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),s=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):u(u({},t),e)),n},c=function(e){var t=s(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=s(n),f=r,m=d["".concat(l,".").concat(f)]||d[f]||p[f]||o;return n?a.createElement(m,u(u({ref:t},c),{},{components:n})):a.createElement(m,u({ref:t},c))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,u=new Array(o);u[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,u[1]=i;for(var s=2;s<o;s++)u[s]=n[s];return a.createElement.apply(null,u)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},8215:function(e,t,n){var a=n(7294);t.Z=function(e){var t=e.children,n=e.hidden,r=e.className;return a.createElement("div",{role:"tabpanel",hidden:n,className:r},t)}},6396:function(e,t,n){n.d(t,{Z:function(){return d}});var a=n(7462),r=n(7294),o=n(2389),u=n(9443);var i=function(){var e=(0,r.useContext)(u.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},l=n(9521),s=n(6010),c="tabItem_vU9c";function p(e){var t,n,a,o=e.lazy,u=e.block,p=e.defaultValue,d=e.values,f=e.groupId,m=e.className,h=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),v=null!=d?d:h.map((function(e){var t=e.props;return{value:t.value,label:t.label}})),b=(0,l.lx)(v,(function(e,t){return e.value===t.value}));if(b.length>0)throw new Error('Docusaurus error: Duplicate values "'+b.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var g=null===p?p:null!=(t=null!=p?p:null==(n=h.find((function(e){return e.props.default})))?void 0:n.props.value)?t:null==(a=h[0])?void 0:a.props.value;if(null!==g&&!v.some((function(e){return e.value===g})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+g+'" but none of its children has the corresponding value. Available values are: '+v.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=i(),k=y.tabGroupChoices,x=y.setTabGroupChoices,C=(0,r.useState)(g),w=C[0],j=C[1],N=[],O=(0,l.o5)().blockElementScrollPositionUntilNextRender;if(null!=f){var T=k[f];null!=T&&T!==w&&v.some((function(e){return e.value===T}))&&j(T)}var _=function(e){var t=e.currentTarget,n=N.indexOf(t),a=v[n].value;a!==w&&(O(t),j(a),null!=f&&x(f,a))},E=function(e){var t,n=null;switch(e.key){case"ArrowRight":var a=N.indexOf(e.currentTarget)+1;n=N[a]||N[0];break;case"ArrowLeft":var r=N.indexOf(e.currentTarget)-1;n=N[r]||N[N.length-1]}null==(t=n)||t.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":u},m)},v.map((function(e){var t=e.value,n=e.label;return r.createElement("li",{role:"tab",tabIndex:w===t?0:-1,"aria-selected":w===t,className:(0,s.Z)("tabs__item",c,{"tabs__item--active":w===t}),key:t,ref:function(e){return N.push(e)},onKeyDown:E,onFocus:_,onClick:_},null!=n?n:t)}))),o?(0,r.cloneElement)(h.filter((function(e){return e.props.value===w}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},h.map((function(e,t){return(0,r.cloneElement)(e,{key:t,hidden:e.props.value!==w})}))))}function d(e){var t=(0,o.Z)();return r.createElement(p,(0,a.Z)({key:String(t)},e))}},9443:function(e,t,n){var a=(0,n(7294).createContext)(void 0);t.Z=a},5775:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return d},default:function(){return m}});var a=n(7462),r=n(3366),o=(n(7294),n(3905)),u=n(6396),i=n(8215),l=["components"],s={id:"fauna",title:"FaunaDB"},c="FaunaDB",p={unversionedId:"adapters/fauna",id:"adapters/fauna",isDocsHomePage:!1,title:"FaunaDB",description:"This is the Fauna Adapter for next-auth. This package can only be used in conjunction with the primary next-auth package. It is not a standalone package.",source:"@site/docs/adapters/fauna.md",sourceDirName:"adapters",slug:"/adapters/fauna",permalink:"/adapters/fauna",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/adapters/fauna.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"fauna",title:"FaunaDB"},sidebar:"docs",previous:{title:"Prisma",permalink:"/adapters/prisma"},next:{title:"DynamoDB",permalink:"/adapters/dynamodb"}},d=[{value:"Getting Started",id:"getting-started",children:[],level:2},{value:"Schema",id:"schema",children:[],level:2}],f={toc:d};function m(e){var t=e.components,n=(0,r.Z)(e,l);return(0,o.kt)("wrapper",(0,a.Z)({},f,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"faunadb"},"FaunaDB"),(0,o.kt)("p",null,"This is the Fauna Adapter for ",(0,o.kt)("a",{parentName:"p",href:"https://next-auth.js.org"},(0,o.kt)("inlineCode",{parentName:"a"},"next-auth")),". This package can only be used in conjunction with the primary ",(0,o.kt)("inlineCode",{parentName:"p"},"next-auth")," package. It is not a standalone package."),(0,o.kt)("p",null,"You can find the Fauna schema and seed information in the docs at ",(0,o.kt)("a",{parentName:"p",href:"https://next-auth.js.org/adapters/fauna"},"next-auth.js.org/adapters/fauna"),"."),(0,o.kt)("h2",{id:"getting-started"},"Getting Started"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"Install the necessary packages")),(0,o.kt)(u.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,o.kt)(i.Z,{value:"npm",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"npm install next-auth @next-auth/fauna-adapter faunadb\n"))),(0,o.kt)(i.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add next-auth @next-auth/fauna-adapter faunadb\n")))),(0,o.kt)("ol",{start:2},(0,o.kt)("li",{parentName:"ol"},"Add this adapter to your ",(0,o.kt)("inlineCode",{parentName:"li"},"pages/api/[...nextauth].js")," next-auth configuration object.")),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript",metastring:'title="pages/api/auth/[...nextauth].js"',title:'"pages/api/auth/[...nextauth].js"'},'import NextAuth from "next-auth"\nimport { Client as FaunaClient } from "faunadb"\nimport { FaunaAdapter } from "@next-auth/fauna-adapter"\n\nconst client = new FaunaClient({\n  secret: "secret",\n  scheme: "http",\n  domain: "localhost",\n  port: 8443,\n})\n\n// For more information on each option (and a full list of options) go to\n// https://next-auth.js.org/configuration/options\nexport default NextAuth({\n  // https://next-auth.js.org/providers/overview\n  providers: [],\n  adapter: FaunaAdapter(client)\n  ...\n})\n')),(0,o.kt)("h2",{id:"schema"},"Schema"),(0,o.kt)("p",null,"Run the following commands inside of the ",(0,o.kt)("inlineCode",{parentName:"p"},"Shell")," tab in the Fauna dashboard to setup the appropriate collections and indexes."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-javascript"},'CreateCollection({ name: "accounts" })\nCreateCollection({ name: "sessions" })\nCreateCollection({ name: "users" })\nCreateCollection({ name: "verification_tokens" })\nCreateIndex({\n  name: "account_by_provider_and_provider_account_id",\n  source: Collection("accounts"),\n  unique: true,\n  terms: [\n    { field: ["data", "provider"] },\n    { field: ["data", "providerAccountId"] },\n  ],\n})\nCreateIndex({\n  name: "session_by_session_token",\n  source: Collection("sessions"),\n  unique: true,\n  terms: [{ field: ["data", "sessionToken"] }],\n})\nCreateIndex({\n  name: "user_by_email",\n  source: Collection("users"),\n  unique: true,\n  terms: [{ field: ["data", "email"] }],\n})\nCreateIndex({\n  name: "verification_token_by_identifier_and_token",\n  source: Collection("verification_tokens"),\n  unique: true,\n  terms: [{ field: ["data", "identifier"] }, { field: ["data", "token"] }],\n})\n')))}m.isMDXComponent=!0}}]);