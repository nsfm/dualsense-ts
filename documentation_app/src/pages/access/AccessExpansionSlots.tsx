import React from "react";
import {
  FeaturePage,
  Prose,
} from "../../components/FeaturePage";

const AccessExpansionSlots: React.FC = () => (
  <FeaturePage
    title="Expansion Slots"
    subtitle="Detect and configure expansion button accessories."
  >
    <Prose>
      <p style={{ color: "rgba(191, 204, 214, 0.4)" }}>
        Expansion slot support is under development. This will include
        detecting connected expansion buttons, identifying accessory types,
        and configuring slot assignments.
      </p>
    </Prose>
  </FeaturePage>
);

export default AccessExpansionSlots;
