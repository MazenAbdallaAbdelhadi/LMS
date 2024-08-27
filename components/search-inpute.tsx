"use client";
import qs from "query-string"
import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export const SearchInput = () => {
    const [value, setValue] = useState("");
    const debouncedValue = useDebounce(value);

    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const currentCategoryId = searchParams.get("categoryId");

    useEffect(()=>{
        const url = qs.stringifyUrl({
            url: pathname,
            query:{
                categoryId: currentCategoryId,
                title: debouncedValue,
            }
        }, {skipEmptyString: true, skipNull: true});

        router.push(url);
    },[debouncedValue, currentCategoryId, router, pathname])

  return (
    <div className="relative">
      <SearchIcon className="size-4 absolute top-[50%] left-3 translate-y-[-50%] text-slate-600" />

      <Input
        onChange={(e)=> setValue(e.target.value)}
        value={value}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a course"
      />
    </div>
  );
};