"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";

import type { PrepLink } from "@/constants/resources";
import { Input } from "@/components/ui/input";

export type ResourceRoleItem = {
  role: string;
  type: string;
  techstack: string[];
  links: PrepLink[];
};

export function ResourcesExplorer({ items }: { items: ResourceRoleItem[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.role.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.techstack.some((t) => t.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-xl">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-light-400"
          aria-hidden
        />
        <Input
          type="search"
          placeholder="Search by role, interview type, or tech…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-11 rounded-full border-light-800 bg-dark-200 pl-10 text-primary-100 placeholder:text-light-400"
          aria-label="Filter resources by role or tech"
        />
      </div>

      <p className="text-sm text-light-100">
        Showing {filtered.length} of {items.length} roles.
      </p>

      <ul className="m-0 flex list-none flex-col gap-5 p-0">
        {filtered.map((item) => (
          <li key={item.role} className="list-none">
            <article className="card-interview gap-5 p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold capitalize text-primary-100">
                    {item.role}
                  </h2>
                  <p className="mt-1 text-sm text-light-100">
                    <span className="font-medium text-primary-200">
                      {item.type}
                    </span>
                    <span className="mx-2 text-light-400">·</span>
                    {item.techstack.join(", ")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t border-light-800/60 pt-4">
                {item.links.map((link) => (
                  <a
                    key={`${item.role}-${link.href}`}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-light-800 bg-dark-200 px-3 py-1.5 text-sm text-primary-200 transition-colors hover:border-primary-200/50 hover:bg-dark-300"
                  >
                    {link.label}
                    <ExternalLink className="size-3.5 shrink-0 opacity-70" />
                  </a>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? (
        <p className="text-center text-light-100">No roles match that search.</p>
      ) : null}
    </div>
  );
}
