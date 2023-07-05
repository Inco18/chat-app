import SettingsNavigation from "../components/settings/SettingsNavigation";
import BlocksList from "../components/settings/BlocksList";

const Settings = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100% - 3rem)",
      }}
    >
      <SettingsNavigation />
      <BlocksList />
    </div>
  );
};

export default Settings;
