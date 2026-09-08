import Link from "next/link";
import { SITE } from "@/lib/site";
import { Button, Container } from "@/components/ui";
import { ArrowRight, PhoneIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="py-20 lg:py-32">
      <Container className="max-w-2xl text-center">
        <p className="eyebrow">Fehler 404</p>
        <h1 className="display-xl mt-4 text-balance">Diese Seite haben wir wohl schon entrümpelt.</h1>
        <p className="mt-6 text-lg text-muted">Die angeforderte Seite existiert nicht mehr oder wurde verschoben. Hier geht es weiter:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">Zur Startseite <ArrowRight className="h-5 w-5" /></Button>
          <Button href="/ratgeber/" variant="outline" size="lg">Ratgeber</Button>
          <Button href={SITE.phoneMobileHrefPlain} variant="dark" size="lg"><PhoneIcon className="h-5 w-5 text-leaf-400" /> {SITE.phoneMobile}</Button>
        </div>
        <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-semibold text-leaf-700">
          {SITE.services.map((s) => <li key={s.path}><Link href={s.path} className="hover:underline">{s.title}</Link></li>)}
        </ul>
      </Container>
    </section>
  );
}
