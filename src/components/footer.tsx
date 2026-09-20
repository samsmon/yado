export function Footer() {
  return (
    <footer className="w-full border-t border-hairline px-6 pt-14 pb-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6">
        <span className="font-jp text-2xl text-moss">宿</span>

        <div className="flex items-center gap-6 text-xs text-foreground/45">
          <a href="https://github.com/samsmon/sso.yado" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/80 hover:underline underline-offset-4">
            sso.yado
          </a>
          <a href="https://github.com/samsmon/malas" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/80 hover:underline underline-offset-4">
            malas
          </a>
          <a href="https://github.com/samsmon/yado" target="_blank" rel="noopener noreferrer" className="hover:text-foreground/80 hover:underline underline-offset-4">
            yado
          </a>
        </div>

        <span className="text-[11px] text-foreground/35">
          &copy; {new Date().getFullYear()} Yado. All services SSO-enabled.
        </span>
      </div>
    </footer>
  );
}
