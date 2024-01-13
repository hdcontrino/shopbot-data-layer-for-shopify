import React from 'react';
import { reactExtension } from '@shopify/ui-extensions-react/checkout';
import { RemixBrowser } from '@remix-run/react';

export default reactExtension(
  'purchase.checkout.header.render-after',
  () => <Extension />,
);

function createDataLayer() {
  console.log("create");
}

function Extension() {
  //setInterval(() => {
  //  var dl = JSON.parse(sessionStorage.getItem("dataLayer"));
  //  if (!dl._r) {
  //    dl._r = true;
  //    sessionStorage.setItem("dataLayer", JSON.stringify(dl));
  //    window.dataLayer.push(dl);
  //  }
  //}, 1000);
  
}
