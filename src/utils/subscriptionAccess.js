export const getProfilePayload = (response) => response?.data ?? response ?? null;

export const getSubscriptionPlanName = (profile) =>
  String(
    profile?.SubscriptionPlan ||
      profile?.subscriptionPlan ||
      profile?.subscription?.planName ||
      profile?.subscription?.plan?.name ||
      profile?.planName ||
      "",
  ).trim();

export const getSubscriptionStatus = (profile) =>
  String(
    profile?.SubscriptionStatus ||
      profile?.subscriptionStatus ||
      profile?.subscription?.status ||
      profile?.userSubscription?.status ||
      "",
  )
    .trim()
    .toLowerCase();

export const hasPaidPlanAccess = (profile) => {
  const planName = getSubscriptionPlanName(profile).toLowerCase();
  const status = getSubscriptionStatus(profile);

  if (!planName) {
    return false;
  }

  if (
    planName.includes("free") ||
    planName.includes("community") ||
    planName.includes("no active")
  ) {
    return false;
  }

  if (
    status.includes("pending") ||
    status.includes("review") ||
    status.includes("inactive") ||
    status.includes("cancel") ||
    status.includes("reject")
  ) {
    return false;
  }

  return true;
};
