<template>
  <div>
    <h1>Client Side Rendering</h1>
    <p>
      This page uses the <strong>useSession()</strong> Vue Composable in the <strong>&lt;Header/&gt;</strong> component.
    </p>
    <p>
      The <strong>useSession()</strong> Vue Composable is easy to use and allows pages to render very quickly.
    </p>
    <p>
      The advantage of this approach is that session state is shared between pages by using a provided session via <strong>Vue Plugin</strong> so
      that navigation between pages using <strong>useSession()</strong> is very fast.
    </p>
    <p>
      The disadvantage of <strong>useSession()</strong> is that it requires client side JavaScript.
    </p>
  </div>
</template>
