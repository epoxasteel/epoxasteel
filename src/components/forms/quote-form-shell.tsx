'use client';

import { useSearchParams } from 'next/navigation';
import { products } from '@/content/products';
import { QuoteForm } from '@/components/forms/quote-form';

/**
 * Reads the `?product=` parameter written by the "Quote this product" buttons
 * and pre-selects it, so arriving from a product page does not mean re-choosing
 * the thing you just clicked.
 *
 * Split out from the page (and wrapped in Suspense there) because
 * `useSearchParams` opts a component out of static rendering — this keeps the
 * rest of /quote prerendered.
 */
export function QuoteFormShell() {
  const searchParams = useSearchParams();
  const requested = searchParams.get('product');

  // Only honour a value that matches the catalogue — never trust a query string
  // to populate a select.
  const match = requested
    ? products.find((product) => product.name.toLowerCase() === requested.toLowerCase())?.name
    : undefined;

  return <QuoteForm defaultProduct={match} />;
}
