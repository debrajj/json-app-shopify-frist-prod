export async function uploadToShopifyCDN(file) {
  const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
  const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';

  const stagedUploadMutation = `
    mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
      stagedUploadsCreate(input: $input) {
        stagedTargets {
          url
          resourceUrl
          parameters {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Call Shopify GraphQL API directly
  const response = await fetch(`https://${shopDomain}/admin/api/${apiVersion}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken
    },
    body: JSON.stringify({
      query: stagedUploadMutation,
      variables: {
        input: [{
          resource: 'FILE',
          filename: file.originalname,
          mimeType: file.mimetype,
          fileSize: file.size.toString(),
          httpMethod: 'POST'
        }]
      }
    })
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(`Shopify API Error: ${JSON.stringify(result.errors)}`);
  }

  const stagedTarget = result.data.stagedUploadsCreate.stagedTargets[0];
  
  // Upload file to staged URL
  const formData = new FormData();
  stagedTarget.parameters.forEach(param => {
    formData.append(param.name, param.value);
  });
  formData.append('file', file.buffer);

  await fetch(stagedTarget.url, {
    method: 'POST',
    body: formData
  });

  return stagedTarget.resourceUrl;
}
