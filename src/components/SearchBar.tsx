// src/components/SearchBar.tsx
import { Input } from "@nextui-org/react";
import { Search } from "lucide-react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <Input
      classNames={{
        base: "sm:max-w-[10rem] h-10 w-full  ",
        mainWrapper: "h-full",
        input: "text-small",
        inputWrapper: "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
      }}
      placeholder="Type to search..."
      size="sm"
      startContent={<Search size={18} />}
      type="search"
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}