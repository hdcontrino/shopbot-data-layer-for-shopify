import { register } from "@shopify/web-pixels-extension";

register(async ({ analytics, browser }) => {

  const gtm = (evt, obj) => {
    browser.sessionStorage.setItem("dataLayer", JSON.stringify({
      _r: false, ...obj,
      ...{ event: evt },
    }));
  }

  analytics.subscribe("page_viewed", (event) => {
    gtm('page_view', {
      pageTitle: event.context.document.title,
      browser: event.context.navigator.userAgent,
    })
  });

  analytics.subscribe("product_viewed", (event) => {
    var id = event.data.productVariant.sku
      ? event.data.productVariant.sku
      : event.data.productVariant.id;
    var items = [{
      item_id: id,
      item_name: event.data.productVariant.product.title,
      item_brand: event.data.productVariant.product.vendor,
      item_category: event.data.productVariant.product.type,
      item_list_name: event.data.productVariant.title,
      price: event.data.productVariant.price.amount,
      id: event.data.productVariant.id,
    }];
    gtm('view_item', {
      ecommerce: {
        currency: event.data.productVariant.price.currencyCode,
        value: event.data.productVariant.price.amount,
        items
      }
    });
  });

  analytics.subscribe("collection_viewed", (event) => {
    var items = [];
    event.data.collection.productVariants.forEach((e, f) => {
      var id = e.sku ? e.sku : e.id;
      items.push({
        id: id,
        index: f+1,
        item_id: e.product.id,
        item_name: e.product.title,
        item_brand: e.product.vendor,
        item_category: e.product.type,
        item_list_name: e.title,
        price: e.price.amount,
      });
    });
    gtm('view_item_list', {
      ecommerce: {
        currency: event.data.collection.productVariants[0].price.currencyCode,
        items
      },
    });
  })

  analytics.subscribe("product_added_to_cart", (event) => {
    var id = event.data.cartLine.merchandise.sku
      ? event.data.cartLine.merchandise.sku
      : event.data.cartLine.merchandise.id;
    var items = [{
      item_id: id,
      item_name: event.data.cartLine.merchandise.product.title,
      item_brand: event.data.cartLine.merchandise.product.vendor,
      item_category: event.data.cartLine.merchandise.product.type,
      item_list_name: event.data.cartLine.merchandise.title,
      price: event.data.cartLine.merchandise.price.amount,
      quantity: event.data.cartLine.quantity,
      id: event.data.cartLine.merchandise.product.id,
    }];
    gtm('add_to_cart', {
      ecommerce: {
        currency: event.data.cartLine.cost.totalAmount.currencyCode,
        value: event.data.cartLine.cost.totalAmount.amount,
        items
      }
    });
  });

  analytics.subscribe("cart_viewed", (event) => {
    var items = [];
    event.data.cart.lines.forEach((e, f) => {
      var id = e.merchandise.sku ? e.merchandise.sku : e.merchandise.id;
      items.push({
        id: id,
        item_id: e.merchandise.product.id,
        item_name: e.merchandise.product.title,
        item_brand: e.merchandise.product.vendor,
        item_category: e.merchandise.product.type,
        price: e.merchandise.price.amount,
        quantity: e.quantity,
      });
    });
    gtm('view_cart', {
      ecommerce: {
        currency: event.data.cart.cost.totalAmount.currencyCode,
        value: event.data.cart.cost.totalAmount.amount,
        items
      }
    });
  });

  analytics.subscribe("checkout_started", (event) => {
    var items = [];
    event.data.checkout.lineItems.forEach((e, f) => {
      var id = e.variant.sku ? e.variant.sku : e.variant.id;
      items.push({
        id: id,
        item_id: e.variant.product.id,
        item_name: e.variant.product.title,
        item_brand: e.variant.product.vendor,
        item_category: e.variant.product.type,
        price: e.variant.price.amount,
        quantity: e.quantity,
      });
    });
    gtm('begin_checkout', {
      ecommerce: {
        currency: event.data.checkout.totalPrice.currencyCode,
        value: event.data.checkout.totalPrice.amount,
        items
      }
    });
  });

  analytics.subscribe("checkout_address_info_submitted", (event) => {
    var items = [];
    event.data.checkout.lineItems.forEach((e, f) => {
      var id = e.variant.sku ? e.variant.sku : e.variant.id;
      items.push({
        id: id,
        item_id: e.variant.product.id,
        item_name: e.variant.product.title,
        item_brand: e.variant.product.vendor,
        item_category: e.variant.product.type,
        price: e.variant.price.amount,
        quantity: e.quantity,
      });
    });
    gtm('add_shipping_info', {
      checkout: event.data.checkout,
      ecommerce: {
        currency: event.data.checkout.totalPrice.currencyCode,
        value: event.data.checkout.totalPrice.amount,
        items
      }
    });
  });

  analytics.subscribe("payment_info_submitted", (event) => {
    var items = [];
    event.data.checkout.lineItems.forEach((e, f) => {
      var id = e.variant.sku ? e.variant.sku : e.variant.id;
      items.push({
        id: id,
        item_id: e.variant.product.id,
        item_name: e.variant.product.title,
        item_brand: e.variant.product.vendor,
        item_category: e.variant.product.type,
        price: e.variant.price.amount,
        quantity: e.quantity,
      });
    });
    gtm('purchase', {
      checkout: event.data.checkout,
      ecommerce: {
        currency: event.data.checkout.totalPrice.currencyCode,
        value: event.data.checkout.totalPrice.amount,
        items
      }
    });
  });

  analytics.subscribe("checkout_completed", (event) => {
    var items = [];
    event.data.checkout.lineItems.forEach((e, f) => {
      var id = e.variant.sku ? e.variant.sku : e.variant.id;
      items.push({
        id: id,
        item_id: e.variant.product.id,
        item_name: e.variant.product.title,
        item_brand: e.variant.product.vendor,
        item_category: e.variant.product.type,
        price: e.variant.price.amount,
        quantity: e.quantity,
      });
    });
    gtm('purchase_success', {
      transaction_id: event.data.checkout.order.id,
      checkout: event.data.checkout,
      currency: event.data.checkout.currencyCode,
      value: event.data.checkout.totalPrice.amount,
      items
    });
  });

});
