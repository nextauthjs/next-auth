"use strict";(self.webpackChunknext_auth_docs=self.webpackChunknext_auth_docs||[]).push([[1277],{3905:function(e,t,n){n.d(t,{Zo:function(){return p},kt:function(){return l}});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var c=r.createContext({}),d=function(e){var t=r.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(c.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),u=d(n),l=a,N=u["".concat(c,".").concat(l)]||u[l]||m[l]||o;return n?r.createElement(N,i(i({ref:t},p),{},{components:n})):r.createElement(N,i({ref:t},p))}));function l(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=u;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s.mdxType="string"==typeof e?e:a,i[1]=s;for(var d=2;d<o;d++)i[d]=n[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},881:function(e,t,n){n.r(t),n.d(t,{frontMatter:function(){return s},contentTitle:function(){return c},metadata:function(){return d},toc:function(){return p},default:function(){return u}});var r=n(7462),a=n(3366),o=(n(7294),n(3905)),i=["components"],s={id:"mssql",title:"Microsoft SQL Server"},c=void 0,d={unversionedId:"adapters/typeorm/mssql",id:"version-v3/adapters/typeorm/mssql",isDocsHomePage:!1,title:"Microsoft SQL Server",description:"Schema for a Microsoft SQL Server (mssql) database.",source:"@site/versioned_docs/version-v3/adapters/typeorm/mssql.md",sourceDirName:"adapters/typeorm",slug:"/adapters/typeorm/mssql",permalink:"/v3/adapters/typeorm/mssql",editUrl:"https://github.com/nextauthjs/docs/edit/main/versioned_docs/version-v3/adapters/typeorm/mssql.md",tags:[],version:"v3",lastUpdatedBy:"Bal\xe1zs Orb\xe1n",lastUpdatedAt:1643982356,formattedLastUpdatedAt:"2/4/2022",frontMatter:{id:"mssql",title:"Microsoft SQL Server"},sidebar:"version-v3/docs",previous:{title:"Postgres",permalink:"/v3/adapters/typeorm/postgres"},next:{title:"MongoDB",permalink:"/v3/adapters/typeorm/mongodb"}},p=[],m={toc:p};function u(e){var t=e.components,n=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,r.Z)({},m,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Schema for a Microsoft SQL Server (mssql) database."),(0,o.kt)("div",{className:"admonition admonition-note alert alert--secondary"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M6.3 5.69a.942.942 0 0 1-.28-.7c0-.28.09-.52.28-.7.19-.18.42-.28.7-.28.28 0 .52.09.7.28.18.19.28.42.28.7 0 .28-.09.52-.28.7a1 1 0 0 1-.7.3c-.28 0-.52-.11-.7-.3zM8 7.99c-.02-.25-.11-.48-.31-.69-.2-.19-.42-.3-.69-.31H6c-.27.02-.48.13-.69.31-.2.2-.3.44-.31.69h1v3c.02.27.11.5.31.69.2.2.42.31.69.31h1c.27 0 .48-.11.69-.31.2-.19.3-.42.31-.69H8V7.98v.01zM7 2.3c-3.14 0-5.7 2.54-5.7 5.68 0 3.14 2.56 5.7 5.7 5.7s5.7-2.55 5.7-5.7c0-3.15-2.56-5.69-5.7-5.69v.01zM7 .98c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.12-7-7 3.14-7 7-7z"}))),"note")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"When using a Microsoft SQL Server database with the default adapter (TypeORM) all properties of type ",(0,o.kt)("inlineCode",{parentName:"p"},"timestamp")," are transformed to ",(0,o.kt)("inlineCode",{parentName:"p"},"datetime"),"."),(0,o.kt)("p",{parentName:"div"},"This transform is also applied to any properties of type ",(0,o.kt)("inlineCode",{parentName:"p"},"timestamp")," when using custom models."))),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql"},"CREATE TABLE accounts\n  (\n    id                    int IDENTITY(1,1) NOT NULL,\n    compound_id           varchar(255) NOT NULL,\n    user_id               int NOT NULL,\n    provider_type         varchar(255) NOT NULL,\n    provider_id           varchar(255) NOT NULL,\n    provider_account_id   varchar(255) NOT NULL,\n    refresh_token         text NULL,\n    access_token          text NULL,\n    access_token_expires  datetime NULL,\n    created_at            datetime NOT NULL DEFAULT getdate(),\n    updated_at            datetime NOT NULL DEFAULT getdate()\n  );\n\nCREATE TABLE sessions\n  (\n    id            int IDENTITY(1,1) NOT NULL,\n    user_id       int NOT NULL,\n    expires       datetime NOT NULL,\n    session_token varchar(255) NOT NULL,\n    access_token  varchar(255) NOT NULL,\n    created_at    datetime NOT NULL DEFAULT getdate(),\n    updated_at    datetime NOT NULL DEFAULT getdate()\n  );\n\nCREATE TABLE users\n  (\n    id              int IDENTITY(1,1) NOT NULL,\n    name            varchar(255) NULL,\n    email           varchar(255) NULL,\n    email_verified  datetime NULL,\n    image           varchar(255) NULL,\n    created_at      datetime NOT NULL DEFAULT getdate(),\n    updated_at      datetime NOT NULL DEFAULT getdate()\n  );\n\nCREATE TABLE verification_requests\n  (\n    id          int IDENTITY(1,1) NOT NULL,\n    identifier  varchar(255) NOT NULL,\n    token       varchar(255) NOT NULL,\n    expires     datetime NOT NULL,\n    created_at  datetime NOT NULL DEFAULT getdate(),\n    updated_at  datetime NOT NULL DEFAULT getdate()\n  );\n\nCREATE UNIQUE INDEX compound_id\n  ON accounts(compound_id);\n\nCREATE INDEX provider_account_id\n  ON accounts(provider_account_id);\n\nCREATE INDEX provider_id\n  ON accounts(provider_id);\n\nCREATE INDEX user_id\n  ON accounts(user_id);\n\nCREATE UNIQUE INDEX session_token\n  ON sessions(session_token);\n\nCREATE UNIQUE INDEX access_token\n  ON sessions(access_token);\n\nCREATE UNIQUE INDEX email\n  ON users(email);\n\nCREATE UNIQUE INDEX token\n  ON verification_requests(token);\n")),(0,o.kt)("p",null,"When using NextAuth.js with SQL Server for the first time, run NextAuth.js once against your database with ",(0,o.kt)("inlineCode",{parentName:"p"},"?synchronize=true")," on the connection string and export the schema that is created.\n:::"))}u.isMDXComponent=!0}}]);