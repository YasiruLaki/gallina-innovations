import React from "react";
import MobileMenu from "@/components/MobileMenu";
import CopyrightFooter from "@/components/footer";
import ProposedClient from "@/components/ProposedClient";

// Temporarily allow `any` here because Next.js may provide a PageProps shape
// that is not easily expressible in this file without importing internal types.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProposedPage(props: any) {
  const searchParams = await props?.searchParams;
  const category = searchParams?.category ?? null;
  return (
    <>
      <MobileMenu />
      <ProposedClient category={category} />
      <CopyrightFooter />
    </>
  );
}
