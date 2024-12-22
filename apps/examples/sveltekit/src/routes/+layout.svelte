<script>
  import "../app.css"
  import Header from "$lib/components/header.svelte"
  import Footer from "$lib/components/footer.svelte"
  import { ModeWatcher } from "mode-watcher"
</script>

<ModeWatcher />
<div class="container px-0">
  <Header></Header>
  <slot></slot>
  <Footer></Footer>
</div>

<style>
  .container {
    height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: stretch;
  }
</style>
