import logo from "@/assets/logo-agk.jpeg";

export function Logo({ className = "h-10" }: { className?: string }) {
  return (
    <img
      src={logo}
      alt="Grupo AGK Eclypse"
      className={`${className} w-auto rounded-md object-contain`}
    />
  );
}
