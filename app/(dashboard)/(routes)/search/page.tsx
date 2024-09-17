import { db } from "@/lib/db";
import Categories from "./_components/categories";
import { SearchInput } from "@/components/search-inpute";
import { getCourses } from "@/actions/get-courses";
import { currentUser } from "@/lib/auth";
import { CoursesList } from "@/components/courses-list";
import { Suspense } from "react";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const user = await currentUser();

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId: user?.id!, ...searchParams });

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />

        <CoursesList items={courses} />
      </div>
    </>
  );
};

export default SearchPage;
