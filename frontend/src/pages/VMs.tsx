import { EmptyPlaceholder } from "@/components/EmptyPlaceholder";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import { VMCreateButton } from "@/components/vm/VMCreateButton";
import { VMItem } from "@/components/vm/VMItem";
import { VM } from "@/types";
import React from "react";

interface VMsProps {}

const vms:VM[] = [
  { id: "skjvnoisjfo", name: "Test", type: "ubuntu" },
  { id: "sjrnvkjsn", name: "Demo",type: "fedora" },
  { id: "skjvnoisjfo", name: "Test", type: "ubuntu" },
  { id: "skjvnoisjfo", name: "Test", type: "kali" },
  { id: "skjvnoisjfo", name: "Test", type: "mint" },
  { id: "skjvnoisjfo", name: "Test", type: "arch" },
  { id: "skjvnoisjfo", name: "Test", type: "opensuse" },
  { id: "skjvnoisjfo", name: "Test", type: "redhat" },
];

const VMs: React.FC<VMsProps> = () => {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Virtual Machines"
        // heading="Posts"
        text="Create and manage virtual machines."
      />
      <div>
        {vms?.length ? (
          <div className="grid grid-cols-3 gap-4">
            {vms.map((vm) => (
              <VMItem key={vm.id} vm={vm} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder>
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No posts created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description>
              You don&apos;t have any posts yet. Start creating content.
            </EmptyPlaceholder.Description>
            <VMCreateButton
            // variant="outline"
            />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
};

export default VMs;
