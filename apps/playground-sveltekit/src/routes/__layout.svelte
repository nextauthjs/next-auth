<script lang="ts">
    import Header from "$lib/components/Header.svelte";
</script>

<div>
    <Header />
    <slot></slot>
</div>

<style>
:global(body) {
  font-family: -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
  padding: 0 1rem 1rem 1rem;
  max-width: 680px;
  margin: 0 auto;
  background: #fff;
  color: #333;
}
:global(li),
:global(p) {
  line-height: 1.5rem;
}
:global(a) {
  font-weight: 500;
}
:global(hr) {
  border: 1px solid #ddd;
}
:global(iframe) {
  background: #ccc;
  border: 1px solid #ccc;
  height: 10rem;
  width: 100%;
  border-radius: .5rem;
  filter: invert(1);
}
</style>