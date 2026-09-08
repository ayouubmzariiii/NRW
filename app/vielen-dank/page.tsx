import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { Button, Container } from "@/components/ui";
import { ProcessSteps } from "@/components/sections";
import { ArrowRight, CheckIcon, PhoneIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Vielen Dank für Ihre Anfrage",
  description: "Vielen Dank für Ihre Anfrage – wir melden uns umgehend bei Ihnen zurück.",
  path: "/vielen-dank/",
  noindex: true,
});

export default function VielenDankPage() {
  return (
    <>
      <section className="py-16 lg:py-24">
        <Container className="max-w-2xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-leaf-500 text-white shadow-glow"><CheckIcon className="h-8 w-8" /></span>
          <h1 className="display-xl mt-8 text-balance">Vielen Dank!</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">Vielen Dank für Ihre Anfrage – wir werden uns umgehend bei Ihnen zurückmelden! Selbstverständlich können Sie uns bei weiteren Fragen auch jederzeit gerne anrufen.</p>
          <p className="mt-4 text-muted">Mit besten Grüßen<br /><strong className="text-ink">Ihr Team von NRW-Haushaltsauflösung</strong></p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href={SITE.phoneMobileHrefPlain} size="lg"><PhoneIcon className="h-5 w-5" /> {SITE.phoneMobile}</Button>
            <Button href="/ratgeber/" variant="outline" size="lg">Ratgeber lesen <ArrowRight className="h-5 w-5" /></Button>
          </div>
        </Container>
      </section>
      <ProcessSteps title="So geht es jetzt weiter" eyebrow="Ablauf" />
    </>
  );
}
