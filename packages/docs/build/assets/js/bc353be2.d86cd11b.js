"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[5107],{3905:function(e,n,t){t.d(n,{Zo:function(){return c},kt:function(){return m}});var o=t(7294);function r(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,o)}return t}function l(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){r(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function i(e,n){if(null==e)return{};var t,o,r=function(e,n){if(null==e)return{};var t,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||(r[t]=e[t]);return r}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)t=a[o],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(r[t]=e[t])}return r}var u=o.createContext({}),s=function(e){var n=o.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):l(l({},n),e)),t},c=function(e){var n=s(e.components);return o.createElement(u.Provider,{value:n},e.children)},p={inlineCode:"code",wrapper:function(e){var n=e.children;return o.createElement(o.Fragment,{},n)}},d=o.forwardRef((function(e,n){var t=e.components,r=e.mdxType,a=e.originalType,u=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),d=s(t),m=r,f=d["".concat(u,".").concat(m)]||d[m]||p[m]||a;return t?o.createElement(f,l(l({ref:n},c),{},{components:t})):o.createElement(f,l({ref:n},c))}));function m(e,n){var t=arguments,r=n&&n.mdxType;if("string"==typeof e||r){var a=t.length,l=new Array(a);l[0]=d;var i={};for(var u in n)hasOwnProperty.call(n,u)&&(i[u]=n[u]);i.originalType=e,i.mdxType="string"==typeof e?e:r,l[1]=i;for(var s=2;s<a;s++)l[s]=t[s];return o.createElement.apply(null,l)}return o.createElement.apply(null,t)}d.displayName="MDXCreateElement"},8215:function(e,n,t){var o=t(7294);n.Z=function(e){var n=e.children,t=e.hidden,r=e.className;return o.createElement("div",{role:"tabpanel",hidden:t,className:r},n)}},6396:function(e,n,t){t.d(n,{Z:function(){return d}});var o=t(7462),r=t(7294),a=t(2389),l=t(9443);var i=function(){var e=(0,r.useContext)(l.Z);if(null==e)throw new Error('"useUserPreferencesContext" is used outside of "Layout" component.');return e},u=t(9521),s=t(6010),c="tabItem_vU9c";function p(e){var n,t,o,a=e.lazy,l=e.block,p=e.defaultValue,d=e.values,m=e.groupId,f=e.className,b=r.Children.map(e.children,(function(e){if((0,r.isValidElement)(e)&&void 0!==e.props.value)return e;throw new Error("Docusaurus error: Bad <Tabs> child <"+("string"==typeof e.type?e.type:e.type.name)+'>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.')})),g=null!=d?d:b.map((function(e){var n=e.props;return{value:n.value,label:n.label}})),h=(0,u.lx)(g,(function(e,n){return e.value===n.value}));if(h.length>0)throw new Error('Docusaurus error: Duplicate values "'+h.map((function(e){return e.value})).join(", ")+'" found in <Tabs>. Every value needs to be unique.');var v=null===p?p:null!=(n=null!=p?p:null==(t=b.find((function(e){return e.props.default})))?void 0:t.props.value)?n:null==(o=b[0])?void 0:o.props.value;if(null!==v&&!g.some((function(e){return e.value===v})))throw new Error('Docusaurus error: The <Tabs> has a defaultValue "'+v+'" but none of its children has the corresponding value. Available values are: '+g.map((function(e){return e.value})).join(", ")+". If you intend to show no default tab, use defaultValue={null} instead.");var y=i(),k=y.tabGroupChoices,x=y.setTabGroupChoices,w=(0,r.useState)(v),O=w[0],N=w[1],T=[],E=(0,u.o5)().blockElementScrollPositionUntilNextRender;if(null!=m){var j=k[m];null!=j&&j!==O&&g.some((function(e){return e.value===j}))&&N(j)}var P=function(e){var n=e.currentTarget,t=T.indexOf(n),o=g[t].value;o!==O&&(E(n),N(o),null!=m&&x(m,o))},D=function(e){var n,t=null;switch(e.key){case"ArrowRight":var o=T.indexOf(e.currentTarget)+1;t=T[o]||T[0];break;case"ArrowLeft":var r=T.indexOf(e.currentTarget)-1;t=T[r]||T[T.length-1]}null==(n=t)||n.focus()};return r.createElement("div",{className:"tabs-container"},r.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,s.Z)("tabs",{"tabs--block":l},f)},g.map((function(e){var n=e.value,t=e.label;return r.createElement("li",{role:"tab",tabIndex:O===n?0:-1,"aria-selected":O===n,className:(0,s.Z)("tabs__item",c,{"tabs__item--active":O===n}),key:n,ref:function(e){return T.push(e)},onKeyDown:D,onFocus:P,onClick:P},null!=t?t:n)}))),a?(0,r.cloneElement)(b.filter((function(e){return e.props.value===O}))[0],{className:"margin-vert--md"}):r.createElement("div",{className:"margin-vert--md"},b.map((function(e,n){return(0,r.cloneElement)(e,{key:n,hidden:e.props.value!==O})}))))}function d(e){var n=(0,a.Z)();return r.createElement(p,(0,o.Z)({key:String(n)},e))}},9443:function(e,n,t){var o=(0,t(7294).createContext)(void 0);n.Z=o},9250:function(e,n,t){t.r(n),t.d(n,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return p},toc:function(){return d},default:function(){return f}});var o=t(7462),r=t(3366),a=(t(7294),t(3905)),l=t(6396),i=t(8215),u=["components"],s={id:"mongodb",title:"MongoDB"},c="MongoDB",p={unversionedId:"adapters/mongodb",id:"adapters/mongodb",isDocsHomePage:!1,title:"MongoDB",description:"The MongoDB adapter does not handle connections automatically, so you will have to make sure that you pass the Adapter a MongoClient that is connected already. Below you can see an example how to do this.",source:"@site/docs/adapters/mongodb.md",sourceDirName:"adapters",slug:"/adapters/mongodb",permalink:"/adapters/mongodb",editUrl:"https://github.com/nextauthjs/docs/edit/main/docs/adapters/mongodb.md",tags:[],version:"current",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"mongodb",title:"MongoDB"},sidebar:"docs",previous:{title:"PouchDB",permalink:"/adapters/pouchdb"},next:{title:"Neo4j",permalink:"/adapters/neo4j"}},d=[{value:"Usage",id:"usage",children:[],level:2}],m={toc:d};function f(e){var n=e.components,t=(0,r.Z)(e,u);return(0,a.kt)("wrapper",(0,o.Z)({},m,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"mongodb"},"MongoDB"),(0,a.kt)("p",null,"The MongoDB adapter does not handle connections automatically, so you will have to make sure that you pass the Adapter a ",(0,a.kt)("inlineCode",{parentName:"p"},"MongoClient")," that is connected already. Below you can see an example how to do this."),(0,a.kt)("h2",{id:"usage"},"Usage"),(0,a.kt)("ol",null,(0,a.kt)("li",{parentName:"ol"},"Install the necessary packages")),(0,a.kt)(l.Z,{groupId:"npm2yarn",mdxType:"Tabs"},(0,a.kt)(i.Z,{value:"npm",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm install next-auth @next-auth/mongodb-adapter mongodb\n"))),(0,a.kt)(i.Z,{value:"yarn",label:"Yarn",mdxType:"TabItem"},(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"yarn add next-auth @next-auth/mongodb-adapter mongodb\n")))),(0,a.kt)("ol",{start:2},(0,a.kt)("li",{parentName:"ol"},"Add ",(0,a.kt)("inlineCode",{parentName:"li"},"lib/mongodb.js"))),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb\nimport { MongoClient } from "mongodb"\n\nconst uri = process.env.MONGODB_URI\nconst options = {\n  useUnifiedTopology: true,\n  useNewUrlParser: true,\n}\n\nlet client\nlet clientPromise\n\nif (!process.env.MONGODB_URI) {\n  throw new Error("Please add your Mongo URI to .env.local")\n}\n\nif (process.env.NODE_ENV === "development") {\n  // In development mode, use a global variable so that the value\n  // is preserved across module reloads caused by HMR (Hot Module Replacement).\n  if (!global._mongoClientPromise) {\n    client = new MongoClient(uri, options)\n    global._mongoClientPromise = client.connect()\n  }\n  clientPromise = global._mongoClientPromise\n} else {\n  // In production mode, it\'s best to not use a global variable.\n  client = new MongoClient(uri, options)\n  clientPromise = client.connect()\n}\n\n// Export a module-scoped MongoClient promise. By doing this in a\n// separate module, the client can be shared across functions.\nexport default clientPromise\n')),(0,a.kt)("ol",{start:3},(0,a.kt)("li",{parentName:"ol"},"Add this adapter to your ",(0,a.kt)("inlineCode",{parentName:"li"},"pages/api/[...nextauth].js")," next-auth configuration object.")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-js"},'import NextAuth from "next-auth"\nimport { MongoDBAdapter } from "@next-auth/mongodb-adapter"\nimport clientPromise from "lib/mongodb"\n\n// For more information on each option (and a full list of options) go to\n// https://next-auth.js.org/configuration/options\nexport default NextAuth({\n  adapter: MongoDBAdapter(clientPromise),\n  ...\n})\n')))}f.isMDXComponent=!0}}]);