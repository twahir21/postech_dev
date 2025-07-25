// src/contexts/RefetchContext.ts
import { createContextId } from '@builder.io/qwik';
import { type Signal } from '@builder.io/qwik';

export interface RefetchFlags {
  saleRefetch: Signal<boolean>;
  productRefetch: Signal<boolean>;
  customerRefetch: Signal<boolean>;
  supplierRefetch: Signal<boolean>;
  refetchAnalytics: Signal<boolean>;
  debtRefetch: Signal<boolean>;

  // Add more flags as needed
}

export const RefetchContext = createContextId<RefetchFlags>('refetch-context');
