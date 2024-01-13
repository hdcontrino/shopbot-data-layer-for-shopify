import { useState } from "react";
import { json } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { authenticate } from "../shopify.server";
import {
  Page,
  Layout,
  Card,
  Button,
  BlockStack,
  InlineStack,
  TextField,
} from "@shopify/polaris";
import { getGTM, setGTM } from "../models/GTM.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const GTM = await getGTM();

  const registerWebPixel = await admin.graphql(`
    mutation webPixelCreate($webPixel: WebPixelInput!) {
      webPixelCreate(webPixel: $webPixel) {
        userErrors {
          field
          message
        }
        webPixel {
          settings
          id
        }
      }
    }
  `, {
    variables: {
      id: "",
      webPixel: {
        settings: { accountID: "1233" }
      }
    }
  });

  const registerWebPixelJson = await registerWebPixel.json();

  const currentAppInstallation = await admin.graphql(`
    query {
      currentAppInstallation {
        id
      }
    }
  `);

  const currentAppInstallationJson = await currentAppInstallation.json();

  const metaFieldToLiquid = await admin.graphql(`
    mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafieldsSetInput) {
        metafields {
          id
          namespace
          key
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    variables: {
      "metafieldsSetInput": [
        {
          "namespace": "ids",
          "key": "gtm_id",
          "type": "single_line_text_field",
          "value": GTM.tag,
          "ownerId": currentAppInstallationJson.data.currentAppInstallation.id
        }
      ]
    }
  }
  );

  return json(GTM);
};

export async function action({ request }) {
  const data = {
    ...Object.fromEntries(await request.formData()),
  };

  await setGTM(data.tag);

  return null;
}

export default function Index() {
  const GTM = useLoaderData();
  const [newTag, setNewTag] = useState(GTM.tag);
  const submit = useSubmit();

  const handleSave = async () => {
    submit({tag: newTag}, { method: "post" });
  };

  return (
    <Page>
      <ui-title-bar title="Shopbot Data Layer"></ui-title-bar>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <InlineStack gap="300" blockAlign="end">
                  <TextField label="GTM-ID" onChange={(newValue) => setNewTag(newValue)} autoComplete="off" value={newTag} />
                  <Button variant="primary" onClick={handleSave}>Guardar</Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}
