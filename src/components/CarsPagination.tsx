import PaginationItem from "@material-ui/lab/PaginationItem";
import React from "react";
import { ParsedUrlQuery, stringify } from "querystring";
import Pagination, {
  PaginationRenderItemParams,
} from "@material-ui/lab/Pagination";
import Link from "next/link";
import { getAsString } from "../getAsString";
import { useRouter } from "next/dist/client/router";

const CarsPagination = ({ totalPages }: { totalPages: number }) => {
  const { query } = useRouter();
  return (
    <Pagination
      page={parseInt(getAsString(query.page) || "1")}
      count={totalPages}
      renderItem={(item) => (
        <PaginationItem
          component={MaterialUiLink}
          query={query}
          item={item}
          {...item}
        />
      )}
    />
  );
};

export interface MaterialUiLinkPros {
  item: PaginationRenderItemParams;
  query: ParsedUrlQuery;
}

const MaterialUiLink = React.forwardRef<HTMLAnchorElement, MaterialUiLinkPros>(
  ({ item, query, ...props }, ref) => {
    const aLink = <a ref={ref} {...props}></a>;
    return (
      <Link
        href={{
          pathname: "/cars",
          query: {
            ...query,
            page: item.page,
          },
        }}
        shallow={true}
      >
        {aLink}
      </Link>
    );
  }
);

export default CarsPagination;
