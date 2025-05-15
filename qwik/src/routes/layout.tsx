import { component$, Slot, useContextProvider, useSignal, useStore } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { RefetchContext } from "~/components/context/refreshContext";
import { globalStoreContext } from "~/components/context/store/globalStore";
import type { globalStoreTypes } from "~/components/context/store/globalStore";
import { CrudService } from "./api/base/oop";



// Store rate data by IP
const rateLimitMap = new Map<string, { count: number; timestamp: number; blockedUntil?: number }>();

const RATE_LIMIT = 100;
const TIME_WINDOW = 10 * 1000; // 10 sec
const BLOCK_DURATION = 5 * 60 * 1000; // 5 min

export const onGet: RequestHandler = async ({ url, request, redirect, error }) => {
  const ip =
    request.headers.get("x-forwarded-for") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  const now = Date.now();
  const record = rateLimitMap.get(ip) ?? { count: 0, timestamp: now };

  // Blocked? Refuse request
  if (record.blockedUntil && now < record.blockedUntil) {
    console.warn(`Blocked IP ${ip} tried again before cooldown.`);
    throw error(429, "Too Many Requests - Try again in 5 minutes.");
  }

  // Reset if window passed
  if (now - record.timestamp > TIME_WINDOW) {
    record.count = 1;
    record.timestamp = now;
    delete record.blockedUntil;
  } else {
    record.count++;
  }

  // Block if exceeded
  if (record.count > RATE_LIMIT) {
    console.warn(`Rate limit exceeded by ${ip}, blocking for 5 min.`);
    record.blockedUntil = now + BLOCK_DURATION;
    rateLimitMap.set(ip, record);
    throw error(429, "Too Many Requests - Try again in 5 minutes.");
  }

  rateLimitMap.set(ip, record);

  // Auth logic
  const isPrivate = url.pathname.startsWith("/private") || url.pathname.startsWith("/api/translate");
  if (isPrivate) {
    const verifyApi = new CrudService("verify-cookie");
    const isVerified = await verifyApi.getEarly();
    console.log(isVerified, url.pathname)
    if (!isVerified.success) throw redirect(302, "/auth");
  }

};

export default component$(() => {
  const saleRefetch = useSignal(false);
  const productRefetch = useSignal(false);
  const customerRefetch = useSignal(false);
  const qrCodeRefetch =  useSignal(false);
  const supplierRefetch = useSignal(false);
  const categoryRefetch = useSignal(false);

  // Provide all signals as a grouped context
  useContextProvider(RefetchContext, {
    saleRefetch,
    productRefetch,
    customerRefetch,
    qrCodeRefetch,
    supplierRefetch,
    categoryRefetch
  });

  // globalStore
const globalStore = useStore<globalStoreTypes>({
  profitPerProduct: [] // This is an array, matching the interface
});

// Provide the store using the context provider
useContextProvider(globalStoreContext, globalStore);


  return <Slot />;
});
