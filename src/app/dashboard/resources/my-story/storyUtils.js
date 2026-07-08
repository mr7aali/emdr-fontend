export const STORIES_PER_PAGE = 3;

export const getBaseUrl = () => {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || process.env.VITE_BASE_URL || "";

  return rawBaseUrl.endsWith("/") ? rawBaseUrl.slice(0, -1) : rawBaseUrl;
};

export const formatDate = (value) => {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const getEntryTitle = (entry, index) => {
  const candidates = [
    entry?.recentHappening,
    entry?.thoughts,
    entry?.triggers,
    entry?.childhood,
  ];
  const firstFilledValue = candidates.find((item) => item?.trim());

  if (!firstFilledValue) {
    return `Story Entry ${index + 1}`;
  }

  const normalizedValue = firstFilledValue.trim();

  if (normalizedValue.length <= 72) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, 72).trim()}...`;
};

export const getCbtFormulations = async (token) => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error("CBT formulation service is not configured.");
  }

  if (!token) {
    throw new Error("Please sign in again to load your story entries.");
  }

  const response = await fetch(`${baseUrl}/api/cbt-formulation`, {
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch story entries.");
  }

  return (result?.data || [])
    .slice()
    .sort(
      (firstItem, secondItem) =>
        new Date(secondItem?.createdAt || 0).getTime() -
        new Date(firstItem?.createdAt || 0).getTime(),
    );
};

export const getCbtFormulationById = async ({ token, formulationId }) => {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    throw new Error("CBT formulation service is not configured.");
  }

  if (!token) {
    throw new Error("Please sign in again to load this story entry.");
  }

  const response = await fetch(
    `${baseUrl}/api/cbt-formulation/${formulationId}`,
    {
      cache: "no-store",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const result = await response.json();

  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "Failed to fetch story entry.");
  }

  return result?.data || null;
};

export const hasContent = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value?.trim?.() || value);
};
