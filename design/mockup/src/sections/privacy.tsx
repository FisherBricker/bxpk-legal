import { ScrollStatements } from "@/components/kokonutui/scroll-text";
import { SlideTextButton } from "@/components/kokonutui/slide-text-button";
import { PlainSection } from "@/components/layout";

const STATEMENTS = [
  {
    line: "This site counts visits, not visitors.",
    detail: "No cookies and nothing stored in your browser, so there is no banner to click through. We see totals, never who you are.",
  },
  { line: "We do not sell personal information.", detail: "Not your gear, not your trips, not your account." },
  {
    line: "Body measurements stay yours.",
    detail:
      "Height, body weight, birthdate and biological sex are used only to estimate the calories a day on trail burns, never shown to anyone else and never used for ads.",
  },
  {
    line: "Your route stays on your phone.",
    detail: "A recorded route leaves your iPhone only if you export or share the GPX file yourself.",
  },
  {
    line: "Ads never read your pack.",
    detail: "The app shows ads, but your gear, trips, posts and measurements are never used to target them.",
  },
];

export function Privacy() {
  return (
    <PlainSection className="relative overflow-hidden py-24 lg:py-36" ground="night" id="privacy" labelledBy="privacy-heading">
      <div className="relative grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <h2 className="display-2" id="privacy-heading">
            Your pack is your business
          </h2>
          <SlideTextButton className="mt-8" href="#privacy" hoverText="Read the privacy policy" text="Read the privacy policy" />
        </div>
        <ScrollStatements items={STATEMENTS} />
      </div>
    </PlainSection>
  );
}
