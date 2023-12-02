function deleteProduct(btn) {
  const prodId = btn.parnetNode.querySelector("name=productId").value;
  const csrf = btn.parnetNode.querySelector("name=_csrf").value;

  const productElement = btn.closest("article");

  fetch(`/admin/product/${prodId}`, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      console.log(data);
      productElement.parnetNode.removeChild(productElement);
    })
    .catch((err) => console.log(err));
}
