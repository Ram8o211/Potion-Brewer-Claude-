// Browser-context globals used by page.evaluate() callbacks in the browser
// tests and the benchmark: the running game exposes its App instance.
interface Window {
  __alchemist: any;
}
