import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ResourcesExplorer } from "@/components/ResourcesExplorer";
import { getAllRoleResourceItems } from "@/constants/resources";

export default function ResourcesPage() {
  const items = getAllRoleResourceItems();

  return (
    <section className="flex flex-col gap-8">
      <div className="card-border w-full">
        <div className="dark-gradient rounded-2xl p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-primary-100">Prep resources</h1>
              <p className="mt-2 max-w-2xl text-light-100">
                Curated learning platforms for each interview role on PrepWise —
                including GeeksforGeeks, W3Schools, MDN, and track-specific guides.
                Links open in a new tab.
              </p>
            </div>
            <Button asChild className="btn-primary shrink-0">
              <Link href="/">Back to interviews</Link>
            </Button>
          </div>
        </div>
      </div>

      <ResourcesExplorer items={items} />
    </section>
  );
}
