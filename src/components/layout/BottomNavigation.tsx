const navigationItems = [
  { label: "Sākums", icon: "⌂" },
  { label: "Spēles", icon: "◉" },
  { label: "Turnīri", icon: "♛" },
  { label: "Paziņojumi", icon: "♢" },
  { label: "Profils", icon: "○" },
];

export function BottomNavigation() {
  return (
    <nav className="sticky bottom-0 z-50 border-t border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto grid h-20 w-full max-w-md grid-cols-5 px-2">
        {navigationItems.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className={`flex flex-col items-center justify-center gap-1 text-xs ${
              index === 0 ? "font-semibold text-black" : "text-black/50"
            }`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}