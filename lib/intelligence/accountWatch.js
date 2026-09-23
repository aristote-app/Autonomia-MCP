function numeric(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function createAccountWatchState(account = {}) {
  const signalCount = numeric(account.signal_count);
  return {
    type: "account_watch_v1",
    account_slug: account.slug || null,
    account_name: account.name || null,
    acknowledged_signal_count: signalCount,
    current_signal_count: signalCount,
    unseen_signal_delta: 0,
    current_heat: numeric(account.heat_score),
    current_heat_label: account.heat_label || null,
    latest_signal_title: account.timeline?.[0]?.title || null,
    latest_signal_url: account.timeline?.[0]?.source_url || null,
    latest_signal_at: account.timeline?.[0]?.date || null,
    last_changed_at: null
  };
}

export function refreshAccountWatchState(previous = {}, account = {}, now = new Date().toISOString()) {
  const acknowledged = numeric(
    previous.acknowledged_signal_count,
    numeric(previous.current_signal_count)
  );
  const previousCurrent = numeric(previous.current_signal_count, acknowledged);
  const current = numeric(account.signal_count);
  const increased = current > previousCurrent;

  return {
    ...previous,
    type: "account_watch_v1",
    account_slug: account.slug || previous.account_slug || null,
    account_name: account.name || previous.account_name || null,
    acknowledged_signal_count: acknowledged,
    current_signal_count: current,
    unseen_signal_delta: Math.max(0, current - acknowledged),
    current_heat: numeric(account.heat_score),
    current_heat_label: account.heat_label || null,
    latest_signal_title: account.timeline?.[0]?.title || null,
    latest_signal_url: account.timeline?.[0]?.source_url || null,
    latest_signal_at: account.timeline?.[0]?.date || null,
    last_changed_at: increased ? now : previous.last_changed_at || null
  };
}

export function acknowledgeAccountWatchState(state = {}, now = new Date().toISOString()) {
  const current = numeric(state.current_signal_count);
  return {
    ...state,
    acknowledged_signal_count: current,
    unseen_signal_delta: 0,
    acknowledged_at: now
  };
}
