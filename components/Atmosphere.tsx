/** Site-wide film grain + drifting light — pure visual, no interaction. */
export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-grain" />
      <div className="atmosphere-bloom atmosphere-bloom--a" />
      <div className="atmosphere-bloom atmosphere-bloom--b" />
      <div className="atmosphere-vignette" />
    </div>
  );
}
