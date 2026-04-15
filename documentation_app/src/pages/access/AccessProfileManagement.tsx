import React from "react";
import {
  FeaturePage,
  Prose,
} from "../../components/FeaturePage";

const AccessProfileManagement: React.FC = () => (
  <FeaturePage
    title="Profile Management"
    subtitle="Read and write controller profile configurations."
  >
    <Prose>
      <p style={{ color: "rgba(191, 204, 214, 0.4)" }}>
        Profile management support is under development. This will include
        reading the current profile configuration, writing custom button
        mappings, and managing profile slots programmatically.
      </p>
    </Prose>
  </FeaturePage>
);

export default AccessProfileManagement;
