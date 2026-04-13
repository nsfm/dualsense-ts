import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../components/FeaturePage";
import {
  ColorDemo,
  SerialDemo,
  FirmwareDemo,
  FactoryDemo,
} from "../components/diagnostics/ControllerInfoDiagnostic";

const StatusPage: React.FC = () => (
  <FeaturePage
    title="Controller Info"
    subtitle="Body color, serial number, firmware, and factory data."
  >
    <Prose>
      <p>
        Beyond inputs and outputs, the DualSense reports a rich set of identity
        information. Properties like firmware version, body color, and serial
        number are read once when the controller connects and cached for the
        session.
      </p>
    </Prose>

    {/* ── Body Color ──────────────────────────────────────────── */}

    <SectionHeading>Body Color</SectionHeading>
    <Prose>
      <p>
        Every DualSense has a body color programmed at the factory, encoded in
        the serial number. The <code>color</code> getter returns a{" "}
        <Link to="/api/enums">
          <code>DualsenseColor</code>
        </Link>{" "}
        enum value, while <code>factoryInfo</code> provides the raw 2-character
        color code and display name.
      </p>
    </Prose>
    <ColorDemo />
    <CodeBlock
      code={`import { DualsenseColor } from "dualsense-ts";

// Enum value
controller.color; // DualsenseColor.CosmicRed

// Factory info details
controller.factoryInfo.colorName; // "Cosmic Red"
controller.factoryInfo.colorCode; // "02"

// Check for a specific color
if (controller.color === DualsenseColor.StarlightBlue) {
  controller.lightbar.set({ r: 91, g: 155, b: 213 });
}`}
    />
    <Prose>
      <p>Recognized colors and their codes:</p>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Color</th>
            <th>Enum</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>00</code>
            </td>
            <td>White</td>
            <td>
              <code>DualsenseColor.White</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>01</code>
            </td>
            <td>Midnight Black</td>
            <td>
              <code>DualsenseColor.MidnightBlack</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>02</code>
            </td>
            <td>Cosmic Red</td>
            <td>
              <code>DualsenseColor.CosmicRed</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>03</code>
            </td>
            <td>Nova Pink</td>
            <td>
              <code>DualsenseColor.NovaPink</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>04</code>
            </td>
            <td>Galactic Purple</td>
            <td>
              <code>DualsenseColor.GalacticPurple</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>05</code>
            </td>
            <td>Starlight Blue</td>
            <td>
              <code>DualsenseColor.StarlightBlue</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>06</code>
            </td>
            <td>Grey Camouflage</td>
            <td>
              <code>DualsenseColor.GreyCamouflage</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>07</code>
            </td>
            <td>Volcanic Red</td>
            <td>
              <code>DualsenseColor.VolcanicRed</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>08</code>
            </td>
            <td>Sterling Silver</td>
            <td>
              <code>DualsenseColor.SterlingSilver</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>09</code>
            </td>
            <td>Cobalt Blue</td>
            <td>
              <code>DualsenseColor.CobaltBlue</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>10</code>
            </td>
            <td>Chroma Teal</td>
            <td>
              <code>DualsenseColor.ChromaTeal</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>11</code>
            </td>
            <td>Chroma Indigo</td>
            <td>
              <code>DualsenseColor.ChromaIndigo</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>12</code>
            </td>
            <td>Chroma Pearl</td>
            <td>
              <code>DualsenseColor.ChromaPearl</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>30</code>
            </td>
            <td>30th Anniversary</td>
            <td>
              <code>DualsenseColor.Anniversary30th</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Z1</code>
            </td>
            <td>God of War Ragnarok</td>
            <td>
              <code>DualsenseColor.GodOfWarRagnarok</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Z2</code>
            </td>
            <td>Spider-Man 2</td>
            <td>
              <code>DualsenseColor.SpiderMan2</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Z3</code>
            </td>
            <td>Astro Bot</td>
            <td>
              <code>DualsenseColor.AstroBot</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Z4</code>
            </td>
            <td>Fortnite</td>
            <td>
              <code>DualsenseColor.Fortnite</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>Z6</code>
            </td>
            <td>The Last of Us</td>
            <td>
              <code>DualsenseColor.TheLastOfUs</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>ZB</code>
            </td>
            <td>Icon Blue Limited Edition</td>
            <td>
              <code>DualsenseColor.IconBlueLimitedEdition</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>ZE</code>
            </td>
            <td>Genshin Impact</td>
            <td>
              <code>DualsenseColor.GenshinImpact</code>
            </td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <HardwareNote>
      Unrecognized color codes return <code>DualsenseColor.Unknown</code>. If
      you have a controller with a color not listed here, please{" "}
      <a
        href="https://github.com/nsfm/dualsense-ts/pulls"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#48aff0" }}
      >
        open a PR
      </a>{" "}
      — we'd love to add it.
    </HardwareNote>

    {/* ── Serial Number ───────────────────────────────────────── */}

    <SectionHeading>Serial Number</SectionHeading>
    <Prose>
      <p>
        The factory-stamped serial number is a 32-character ASCII string read
        via the test command protocol (Feature Reports 0x80/0x81). It encodes
        the board revision (position 1), body color (positions 4–5), and a
        unique identifier.
      </p>
    </Prose>
    <SerialDemo />
    <CodeBlock
      code={`// Shorthand
controller.serialNumber; // "P3AB02C1D2E3F4G5"

// Via factory info
controller.factoryInfo.serialNumber; // same value`}
    />
    <HardwareNote>
      Factory info requires firmware support (hardwareInfo &ge; 777 and
      mainFirmwareVersion &ge; 65655). Even controllers from 2020 meet this
      threshold. If you find a controller that doesn't, please{" "}
      <a
        href="https://github.com/nsfm/dualsense-ts/issues"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#48aff0" }}
      >
        open an issue
      </a>
      .
    </HardwareNote>

    {/* ── Firmware ────────────────────────────────────────────── */}

    <SectionHeading>Firmware Info</SectionHeading>
    <Prose>
      <p>
        Feature Report 0x20 provides detailed firmware and hardware version
        information. This is read automatically when the controller connects and
        exposed via the <code>firmwareInfo</code> getter. All fields contain
        sensible defaults until the report is received.
      </p>
    </Prose>
    <FirmwareDemo />
    <CodeBlock
      code={`import { formatFirmwareVersion } from "dualsense-ts";

const fw = controller.firmwareInfo;

// Build info
fw.buildDate;       // "Apr 14 2023"
fw.buildTime;       // "12:34:56"
fw.firmwareType;    // 2 or 3 = production firmware

// Version numbers
formatFirmwareVersion(fw.mainFirmwareVersion); // "2.33.0"
formatFirmwareVersion(fw.sblFirmwareVersion);  // "0.8.6"
fw.dspFirmwareVersion;                          // "0031_0001"
formatFirmwareVersion(fw.spiderDspFirmwareVersion); // "0.3.4"

// Hardware info (lower 16 bits used for feature gating)
fw.hardwareInfo;         // 0x0309
fw.softwareSeries;       // software series identifier
fw.deviceInfo;           // raw hex string
fw.updateVersion;        // "01.04"
fw.updateImageInfo;      // update image info byte`}
    />

    {/* ── Factory Info ────────────────────────────────────────── */}

    <SectionHeading>Factory Info</SectionHeading>
    <Prose>
      <p>
        Factory info groups the serial number, body color, and board revision
        into a single <code>FactoryInfo</code> object. It's read via the test
        command protocol — a send/poll exchange over Feature Reports 0x80 and
        0x81.
      </p>
    </Prose>
    <FactoryDemo />
    <CodeBlock
      code={`import type { FactoryInfo } from "dualsense-ts";

const factory: FactoryInfo = controller.factoryInfo;

factory.serialNumber;  // "P3AB02C1D2E3F4G5"
factory.colorName;     // "Cosmic Red"
factory.colorCode;     // "02"
factory.boardRevision; // "BDM-030"`}
    />
    <Prose>
      <p>Known board revisions:</p>
      <table>
        <thead>
          <tr>
            <th>Serial char</th>
            <th>Revision</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>1</code>
            </td>
            <td>BDM-010</td>
          </tr>
          <tr>
            <td>
              <code>2</code>
            </td>
            <td>BDM-020</td>
          </tr>
          <tr>
            <td>
              <code>3</code>
            </td>
            <td>BDM-030</td>
          </tr>
          <tr>
            <td>
              <code>4</code>
            </td>
            <td>BDM-040</td>
          </tr>
          <tr>
            <td>
              <code>5</code>
            </td>
            <td>BDM-050</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <HardwareNote>
      Factory info is gated on firmware version. If a controller's firmware is
      too old to support the test command protocol, default values are used and
      the identity system falls back to the device info from Feature Report
      0x20.
    </HardwareNote>

  </FeaturePage>
);

export default StatusPage;
