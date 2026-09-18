import { fetchJson } from "./http.js";

const UPWORK_GRAPHQL_URL = "https://api.upwork.com/graphql";

function accessToken() {
  const token = process.env.UPWORK_ACCESS_TOKEN;
  if (!token) throw new Error("UPWORK_ACCESS_TOKEN is not configured");
  return token;
}

function headers() {
  const value = {
    authorization: `Bearer ${accessToken()}`,
    "content-type": "application/json"
  };

  if (process.env.UPWORK_TENANT_ID) {
    value["x-upwork-api-tenantid"] = process.env.UPWORK_TENANT_ID;
  }

  return value;
}

const SEARCH_JOBS_QUERY = `
  query SearchJobs($filter: MarketplaceJobPostingsSearchFilter) {
    marketplaceJobPostingsSearch(
      marketPlaceJobFilter: $filter
      searchType: USER_JOBS_SEARCH
      sortAttributes: [{ field: RECENCY }]
    ) {
      totalCount
      edges {
        cursor
        node {
          id
          title
          description
          ciphertext
          amount {
            displayValue
            currency
          }
          skills {
            name
          }
          client {
            totalFeedback
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export async function searchUpworkJobs({ query, first = 20, after = "0" }) {
  if (!query?.trim()) throw new Error("Upwork query is required");

  const safeFirst = Math.min(Math.max(Number(first) || 20, 1), 50);

  const payload = await fetchJson(UPWORK_GRAPHQL_URL, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      query: SEARCH_JOBS_QUERY,
      variables: {
        filter: {
          searchExpression_eq: query.trim(),
          pagination_eq: { after: String(after), first: safeFirst }
        }
      }
    })
  });

  if (payload.errors?.length) {
    throw new Error(payload.errors.map((item) => item.message).join("; "));
  }

  const result = payload.data?.marketplaceJobPostingsSearch;
  const edges = result?.edges || [];

  return {
    source: "upwork",
    total: result?.totalCount ?? edges.length,
    pageInfo: result?.pageInfo || null,
    items: edges.map(({ cursor, node }) => ({
      source: "upwork",
      sourceId: node?.id || null,
      sourceUrl: node?.ciphertext
        ? `https://www.upwork.com/jobs/${encodeURIComponent(node.ciphertext)}`
        : null,
      opportunityType: "freelance_ai",
      title: node?.title || null,
      description: node?.description || null,
      amount: node?.amount || null,
      skills: (node?.skills || []).map((skill) => skill.name).filter(Boolean),
      clientFeedback: node?.client?.totalFeedback ?? null,
      cursor,
      raw: node
    }))
  };
}
