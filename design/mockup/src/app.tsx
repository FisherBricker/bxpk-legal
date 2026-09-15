import { Navbar } from "@/components/kokonutui/morphic-navbar";
import { RouteLine } from "@/components/route";
import { AlsoInPack } from "@/sections/also-in-pack";
import { GearList } from "@/sections/gear-list";
import { Meals } from "@/sections/meals";
import { Resupply } from "@/sections/resupply";
import { Seasons } from "@/sections/seasons";
import { SharedGear } from "@/sections/shared-gear";
import { Trailhead } from "@/sections/trailhead";
import { Walkthrough } from "@/sections/walkthrough";

export default function App() {
  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-paper focus:px-4 focus:py-3 focus:font-bold"
        href="#main"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Trailhead />
        <RouteLine>
          <GearList />
          <Meals />
          <Resupply />
          <SharedGear />
          <Walkthrough />
          <AlsoInPack />
          <Seasons />
        </RouteLine>
        <div className="h-screen bg-paper" />
      </main>
    </>
  );
}
