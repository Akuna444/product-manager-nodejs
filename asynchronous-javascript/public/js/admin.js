function deleteProduct(btn) {
  const prodId = btn.parnetNode.querySelector("name=productId").value;
  const csrf = btn.parnetNode.querySelector("name=_csrf").value;

  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => console.log(result))
    .catch((err) => console.log(err));
}
