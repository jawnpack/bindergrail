import PixelSprite from "./PixelSprite";
import { RIM } from "./ui";

// The voice of every game: hosts, vendors, inspectors, story. Speaker in gold,
// line in cream, optional tell in cyan brackets, blinking caret when there's
// more. (The 30ms typewriter is a client-only enhancement added per game; this
// renders the finished line.)
export default function TextBox({
  speaker,
  line,
  tell,
  caret = true,
  className = "",
}: {
  speaker?: string;
  line: string;
  tell?: string;
  caret?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative bg-ink-800 px-[14px] pb-[18px] pt-3 ${RIM} ${className}`}>
      {speaker ? (
        <span className="font-display text-[9px] text-gold-400">{speaker}</span>
      ) : null}
      <p className="m-0 mt-1 font-body text-[18px] leading-[1.3]">{line}</p>
      {tell ? (
        <p className="m-0 mt-1 font-body text-[15px] leading-[1.3] text-cyan-300">
          [{tell}]
        </p>
      ) : null}
      {caret ? (
        <span className="absolute bottom-2 right-[10px] motion-safe:animate-[bgaBlink_1s_steps(1,end)_infinite]">
          <PixelSprite name="caret" height={6} />
        </span>
      ) : null}
    </div>
  );
}
