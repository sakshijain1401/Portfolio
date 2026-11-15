import { Chapters } from "@/components/Chapters";
import { Desk } from "@/components/Desk";
import { HashScroll } from "@/components/HashScroll";
import { HorizonBridge } from "@/components/HorizonBridge";
import { Story } from "@/components/story/Story";

export default function Page() {
  return (
    <main>
      <HashScroll />
      <Desk />
      <HorizonBridge />
      <Story />
      <Chapters />
    </main>
  );
}
