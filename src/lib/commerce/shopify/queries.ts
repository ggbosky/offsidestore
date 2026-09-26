export const PRODUCT_FRAGMENT = /* GraphQL */ `
  fragment ProductFields on Product {
    id
    handle
    title
    description
    availableForSale
    tags
    clubSlug: metafield(namespace: "custom", key: "club_slug") {
      value
    }
    images(first: 8) {
      nodes {
        url
        altText
      }
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 20) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Products($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      nodes {
        ...ProductFields
      }
    }
  }
`;

export const PRODUCT_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Product($handle: String!) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
`;

export const COLLECTION_QUERY = /* GraphQL */ `
  ${PRODUCT_FRAGMENT}
  query Collection($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      handle
      title
      description
      products(first: $first) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        id
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;
