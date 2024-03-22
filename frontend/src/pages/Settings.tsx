import { UserNameForm } from "@/components/UserNameForm";
import { DashboardHeader } from "@/components/header";
import { DashboardShell } from "@/components/shell";
import React from "react";

interface SettingsProps {}

const Settings: React.FC<SettingsProps> = () => {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage account and website settings."
      />
      <div className="grid gap-10">
        <UserNameForm 
        // user={{ id: user.id, name: user.name || "" }} 
        />
      </div>
    </DashboardShell>
  );
};

export default Settings;
