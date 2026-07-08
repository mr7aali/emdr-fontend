import { baseApi } from "../../api/baseApi";

const normalizeFaqItems = (response) => {
  const payload = response?.data ?? response ?? [];

  if (!Array.isArray(payload)) {
    return [];
  }

  return [...payload]
    .filter((item) => item?.isActive !== false)
    .sort((left, right) => {
      const leftOrder = left?.order ?? left?.displayId ?? 0;
      const rightOrder = right?.order ?? right?.displayId ?? 0;

      return leftOrder - rightOrder;
    });
};

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFaq: builder.query({
      query: () => ({
        url: "/api/faq",
        method: "GET",
      }),
      transformResponse: (response) => normalizeFaqItems(response),
      providesTags: ["FAQ"],
    }),
  }),
  overrideExisting: false,
});

export const { useGetFaqQuery } = faqApi;

export default faqApi;
