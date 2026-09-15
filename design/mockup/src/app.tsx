import { Navbar } from "@/components/kokonutui/morphic-navbar";
import { RouteLine } from "@/components/route";
import { Trailhead } from "@/sections/trailhead";

export default function App() {
  return (
    <>
      <a className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60] focus:rounded-lg focus:bg-paper focus:px-4 focus:py-3 focus:font-bold" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Trailhead />
        <RouteLine>
          <div className="h-[200vh]" id="route" />
        </RouteLine>
      </main>
    </>
  );
}
