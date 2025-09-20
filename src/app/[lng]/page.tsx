import Navbar from "../components/navbar";
import ExperienceSection from "../sections/experience";
import MeSection from "../sections/me";
import SkillsSection from "../sections/skills";
import ContactSection from "../sections/contact";

export default function Home({ params: { lng } }: { params: { lng: "en" | "no" } }) {
  return (
    <div className="flex flex-col">
      <Navbar />
      <main className="w-full px-4 md:px-6 lg:px-8 py-4 space-y-12">
        <section id="me" className="scroll-mt-20">
          <MeSection lng={lng} />
        </section>

        <section id="skills" className="scroll-mt-20">
          <SkillsSection lng={lng} />
        </section>

        <section id="experience" className="scroll-mt-20">
          <ExperienceSection lng={lng} />
        </section>

        <section id="contact" className="scroll-mt-20">
          <ContactSection lng={lng} />
        </section>
      </main>
    </div>
  );
}
