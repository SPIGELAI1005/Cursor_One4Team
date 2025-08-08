import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n, type Lang } from "@/i18n/I18nProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useI18n();
  const set = (l: Lang) => () => setLang(l);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Language: ${lang.toUpperCase()}`}>
          <span className="text-xs font-semibold">{lang.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 z-50 bg-popover text-popover-foreground border shadow-md">
        <DropdownMenuLabel>Language</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={set("en")}>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={set("de")}>
          Deutsch
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
