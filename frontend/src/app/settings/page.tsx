import { SettingsPanel } from "../../components/settings-panel";
import { requireUser } from "../../lib/api";

export default async function SettingsPage() {
  const user = await requireUser();

  return <SettingsPanel user={user} />;
}
