"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

/**
 * Butun ilova uchun yagona kesh (module-level Map).
 * Next.js client-side navigation paytida bu modul qayta yuklanmaydi,
 * shuning uchun sahifadan sahifaga o'tganda ma'lumot saqlanib qoladi.
 *
 *   1-marta kirilganda  -> fetch ketadi, natija Map ga yoziladi
 *   2-marta kirilganda  -> Map dan olinadi, fetch UMUMAN ketmaydi
 *
 * React komponentlari kesh o'zgarishini `useSyncExternalStore` orqali kuzatadi,
 * shuning uchun effect ichida setState chaqirishga hojat yo'q.
 */
const cache = new Map(); // key -> data
const errors = new Map(); // key -> xatolik matni
const inflight = new Map(); // key -> Promise (bir vaqtda bir xil so'rov takrorlanmasligi uchun)

let networkRequests = 0;
let version = 0;
const listeners = new Set();

function emit() {
  version += 1;
  for (const listener of listeners) listener();
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function load(key, url) {
  if (inflight.has(key)) return inflight.get(key);

  const promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return res.json();
    })
    .then((data) => {
      inflight.delete(key);
      cache.set(key, data);
      emit();
      return data;
    })
    .catch((err) => {
      inflight.delete(key);
      errors.set(key, err.message || "Noma'lum xatolik");
      emit();
    });

  inflight.set(key, promise);
  networkRequests += 1;
  emit();
  return promise;
}

export function clearCache(key) {
  if (key) {
    cache.delete(key);
    errors.delete(key);
  } else {
    cache.clear();
    errors.clear();
  }
  emit();
}

/** Sidebar'dagi statistika uchun. */
export function useCacheStats() {
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );
  return { networkRequests, cachedKeys: [...cache.keys()] };
}

/**
 * @param {string} key  kesh kaliti, masalan "users"
 * @param {string} url  backend manzili
 * @returns {{data, loading, error, fromCache, refresh}}
 */
export function useCachedFetch(key, url) {
  const data = useSyncExternalStore(
    subscribe,
    () => cache.get(key),
    () => undefined,
  );
  const error = useSyncExternalStore(
    subscribe,
    () => errors.get(key),
    () => undefined,
  );

  // Mount paytida kesh bo'lgan bo'lsa — tarmoqqa chiqilmagan.
  // "Yangilash" bosilganda bu qayta true bo'ladi.
  const [viaNetwork, setViaNetwork] = useState(() => !cache.has(key));

  useEffect(() => {
    // Kesh yoki xatolik yozuvi bo'lsa — hech qanday so'rov yubormaymiz.
    if (cache.has(key) || errors.has(key)) return;
    load(key, url);
  }, [key, url]);

  const refresh = useCallback(() => {
    setViaNetwork(true);
    clearCache(key);
    load(key, url);
  }, [key, url]);

  return {
    data,
    error,
    loading: data === undefined && error === undefined,
    fromCache: !viaNetwork,
    refresh,
  };
}
