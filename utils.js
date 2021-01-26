function log(params) {
  console.log(params);
}

function within(outer, inner) {
  return (
    outer.left <= inner.left &&
    outer.top <= inner.top &&
    outer.right >= inner.right &&
    outer.bottom >= inner.top
  );
}
