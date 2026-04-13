import React from "react";
import { Link } from "react-router";
import {
  FeaturePage,
  SectionHeading,
  Prose,
  HardwareNote,
  CodeBlock,
} from "../components/FeaturePage";

const HidReportsPage: React.FC = () => (
  <FeaturePage
    title="HID Internals"
    subtitle="Low-level byte maps for every HID report the DualSense sends and receives."
  >
    <Prose>
      <p>
        The DualSense communicates entirely over HID — input reports carry
        controller state at up to 250 Hz, output reports set LEDs, rumble,
        and triggers, and feature reports provide firmware identity, pairing
        info, and access to the DSP test command protocol. The report format
        varies significantly between USB and Bluetooth.
      </p>
      <p>
        This page documents every byte offset as implemented in{" "}
        <code>dualsense-ts</code>. If you're building your own driver or
        debugging raw HID data, this is the reference. Much of this work
        builds on research by{" "}
        <a
          href="https://github.com/nondebug/dualsense"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#48aff0" }}
        >
          nondebug
        </a>
        {" "}and{" "}
        <a
          href="https://github.com/Nielk1/ExtendInput"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#48aff0" }}
        >
          Nielk1
        </a>.
      </p>
    </Prose>

    {/* ── USB vs Bluetooth ───────────────────────────────────── */}

    <SectionHeading>USB vs Bluetooth</SectionHeading>
    <Prose>
      <p>
        The DualSense uses different report IDs and layouts depending on the
        transport. The primary differences:
      </p>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>USB</th>
            <th>Bluetooth</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Input report ID</td>
            <td><code>0x01</code> (64 bytes)</td>
            <td><code>0x01</code> limited (10 bytes) or <code>0x31</code> full (78 bytes)</td>
          </tr>
          <tr>
            <td>Output report ID</td>
            <td><code>0x02</code> (48 bytes)</td>
            <td><code>0x31</code> (78 bytes)</td>
          </tr>
          <tr>
            <td>Output CRC</td>
            <td>None</td>
            <td>CRC-32 at bytes 74–77</td>
          </tr>
          <tr>
            <td>Payload offset</td>
            <td>Starts at byte 1</td>
            <td>Shifted by +1 (extra prefix byte)</td>
          </tr>
          <tr>
            <td>Motion/touch</td>
            <td>Always available</td>
            <td>Requires Feature Report 0x05 read to enable</td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <HardwareNote>
      On Bluetooth, the controller initially sends only the limited 10-byte
      report (0x01) with sticks, buttons, and triggers. Reading Feature
      Report 0x05 triggers a switch to the full 78-byte report (0x31) with
      motion sensors, touchpad, and battery data. The Gamepad API or other
      applications (like Steam) may have already done this.
    </HardwareNote>

    {/* ── Input Report 0x01 USB ──────────────────────────────── */}

    <SectionHeading>Input Report 0x01 — USB</SectionHeading>
    <Prose>
      <p>
        64-byte report containing all controller inputs. Sent continuously
        while connected over USB.
      </p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID</td><td><code>0x01</code></td></tr>
          <tr><td><code>1</code></td><td>Left Stick X</td><td>uint8 → <code>mapAxis(v)</code> → -1…1</td></tr>
          <tr><td><code>2</code></td><td>Left Stick Y</td><td>uint8 → <code>-mapAxis(v)</code> → -1…1 (inverted)</td></tr>
          <tr><td><code>3</code></td><td>Right Stick X</td><td>uint8 → <code>mapAxis(v)</code></td></tr>
          <tr><td><code>4</code></td><td>Right Stick Y</td><td>uint8 → <code>-mapAxis(v)</code> (inverted)</td></tr>
          <tr><td><code>5</code></td><td>Left Trigger (L2)</td><td>uint8 → <code>mapTrigger(v)</code> → 0…1</td></tr>
          <tr><td><code>6</code></td><td>Right Trigger (R2)</td><td>uint8 → <code>mapTrigger(v)</code></td></tr>
          <tr><td><code>7</code></td><td>Reserved</td><td></td></tr>
          <tr><td><code>8</code></td><td>D-Pad + Face Buttons</td><td>Bitfield (see below)</td></tr>
          <tr><td><code>9</code></td><td>Shoulder + Utility Buttons</td><td>Bitfield (see below)</td></tr>
          <tr><td><code>10</code></td><td>System Buttons</td><td>Bitfield (see below)</td></tr>
          <tr><td><code>11–15</code></td><td>Reserved</td><td>5 bytes</td></tr>
          <tr><td><code>16–17</code></td><td>Gyroscope X</td><td>int16 LE → <code>mapGyroAccel</code></td></tr>
          <tr><td><code>18–19</code></td><td>Gyroscope Y</td><td>int16 LE</td></tr>
          <tr><td><code>20–21</code></td><td>Gyroscope Z</td><td>int16 LE</td></tr>
          <tr><td><code>22–23</code></td><td>Accelerometer X</td><td>int16 LE → <code>mapGyroAccel</code></td></tr>
          <tr><td><code>24–25</code></td><td>Accelerometer Y</td><td>int16 LE</td></tr>
          <tr><td><code>26–27</code></td><td>Accelerometer Z</td><td>int16 LE</td></tr>
          <tr><td><code>28–31</code></td><td>Sensor Timestamp</td><td>uint32 LE</td></tr>
          <tr><td><code>32</code></td><td>Reserved</td><td></td></tr>
          <tr><td><code>33</code></td><td>Touch 0 ID + Contact</td><td>Bits 0–6: ID, Bit 7: 0=touching</td></tr>
          <tr><td><code>34–35</code></td><td>Touch 0 X</td><td>12-bit via <code>(uint16LE &lt;&lt; 20) &gt;&gt; 20</code>, max 1920</td></tr>
          <tr><td><code>35–36</code></td><td>Touch 0 Y</td><td>12-bit via <code>uint16LE &gt;&gt; 4</code>, max 1080</td></tr>
          <tr><td><code>37</code></td><td>Touch 1 ID + Contact</td><td>Same layout as byte 33</td></tr>
          <tr><td><code>38–39</code></td><td>Touch 1 X</td><td>12-bit, same extraction as Touch 0</td></tr>
          <tr><td><code>39–40</code></td><td>Touch 1 Y</td><td>12-bit</td></tr>
          <tr><td><code>41–52</code></td><td>Reserved</td><td>12 bytes</td></tr>
          <tr><td><code>53</code></td><td>Battery</td><td>Low nibble: level (0–10), High nibble: <code>ChargeStatus</code></td></tr>
          <tr><td><code>54</code></td><td>Status Flags</td><td>Bit 0: headphone, Bit 1: mic, Bit 2: mute LED, Bit 3: status</td></tr>
          <tr><td><code>55–63</code></td><td>Reserved</td><td>9 bytes</td></tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Button bitfields ───────────────────────────────────── */}

    <SectionHeading>Button Bitfields</SectionHeading>
    <Prose>
      <p>
        Three bytes encode all digital buttons. The byte offsets differ
        between USB and Bluetooth (see offset table below), but the bit
        layout is the same.
      </p>
      <p><strong>Byte 8 (USB) / Byte 9 (BT 0x31) — D-Pad + Face:</strong></p>
      <table>
        <thead>
          <tr>
            <th>Bits</th>
            <th>Field</th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0–3</td><td>D-Pad</td><td>0=Up, 1=Up-Right, 2=Right, 3=Down-Right, 4=Down, 5=Down-Left, 6=Left, 7=Up-Left, 8+=Released</td></tr>
          <tr><td>4</td><td>Square</td><td>1 = pressed</td></tr>
          <tr><td>5</td><td>Cross</td><td>1 = pressed</td></tr>
          <tr><td>6</td><td>Circle</td><td>1 = pressed</td></tr>
          <tr><td>7</td><td>Triangle</td><td>1 = pressed</td></tr>
        </tbody>
      </table>
      <p><strong>Byte 9 (USB) / Byte 10 (BT 0x31) — Shoulders + Utility:</strong></p>
      <table>
        <thead>
          <tr>
            <th>Bit</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0</td><td>L1 (Left Bumper)</td></tr>
          <tr><td>1</td><td>R1 (Right Bumper)</td></tr>
          <tr><td>2</td><td>L2 Button (full press)</td></tr>
          <tr><td>3</td><td>R2 Button (full press)</td></tr>
          <tr><td>4</td><td>Create</td></tr>
          <tr><td>5</td><td>Options</td></tr>
          <tr><td>6</td><td>L3 (Left Stick Click)</td></tr>
          <tr><td>7</td><td>R3 (Right Stick Click)</td></tr>
        </tbody>
      </table>
      <p><strong>Byte 10 (USB) / Byte 11 (BT 0x31) — System:</strong></p>
      <table>
        <thead>
          <tr>
            <th>Bit</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>0</td><td>PlayStation Button</td></tr>
          <tr><td>1</td><td>Touchpad Button</td></tr>
          <tr><td>2</td><td>Mute Button</td></tr>
          <tr><td>3–7</td><td>Reserved</td></tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Input Report 0x01 BT ───────────────────────────────── */}

    <SectionHeading>Input Report 0x01 — Bluetooth (Limited)</SectionHeading>
    <Prose>
      <p>
        ~10-byte report sent by default over Bluetooth before Feature Report
        0x05 is read. Contains only sticks, buttons, and triggers — no
        motion, touchpad, or battery data.
      </p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID</td><td><code>0x01</code></td></tr>
          <tr><td><code>1</code></td><td>Left Stick X</td><td>uint8 → -1…1</td></tr>
          <tr><td><code>2</code></td><td>Left Stick Y</td><td>uint8 (inverted)</td></tr>
          <tr><td><code>3</code></td><td>Right Stick X</td><td>uint8</td></tr>
          <tr><td><code>4</code></td><td>Right Stick Y</td><td>uint8 (inverted)</td></tr>
          <tr><td><code>5</code></td><td>D-Pad + Face Buttons</td><td>Same bitfield layout</td></tr>
          <tr><td><code>6</code></td><td>Shoulder + Utility Buttons</td><td>Same bitfield layout</td></tr>
          <tr><td><code>7</code></td><td>System Buttons</td><td>Same bitfield layout</td></tr>
          <tr><td><code>8</code></td><td>Left Trigger (L2)</td><td>uint8 → 0…1</td></tr>
          <tr><td><code>9</code></td><td>Right Trigger (R2)</td><td>uint8 → 0…1</td></tr>
        </tbody>
      </table>
    </Prose>
    <HardwareNote>
      Note the different field order — in the limited report, triggers come{" "}
      <em>after</em> buttons (bytes 8–9), while in the USB and full
      Bluetooth reports they come <em>before</em> (bytes 5–6).
    </HardwareNote>

    {/* ── Input Report 0x31 BT ───────────────────────────────── */}

    <SectionHeading>Input Report 0x31 — Bluetooth (Full)</SectionHeading>
    <Prose>
      <p>
        78-byte report sent over Bluetooth after Feature Report 0x05 has been
        read. Contains all the same data as the USB report, but with every
        field offset shifted by +1 due to an extra byte at position 1.
      </p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
            <th>USB Equivalent</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID</td><td><code>0x31</code></td></tr>
          <tr><td><code>1</code></td><td>Reserved</td><td>—</td></tr>
          <tr><td><code>2</code></td><td>Left Stick X</td><td>USB byte 1</td></tr>
          <tr><td><code>3</code></td><td>Left Stick Y</td><td>USB byte 2</td></tr>
          <tr><td><code>4</code></td><td>Right Stick X</td><td>USB byte 3</td></tr>
          <tr><td><code>5</code></td><td>Right Stick Y</td><td>USB byte 4</td></tr>
          <tr><td><code>6</code></td><td>Left Trigger</td><td>USB byte 5</td></tr>
          <tr><td><code>7</code></td><td>Right Trigger</td><td>USB byte 6</td></tr>
          <tr><td><code>8</code></td><td>Reserved</td><td>USB byte 7</td></tr>
          <tr><td><code>9</code></td><td>D-Pad + Face Buttons</td><td>USB byte 8</td></tr>
          <tr><td><code>10</code></td><td>Shoulder + Utility</td><td>USB byte 9</td></tr>
          <tr><td><code>11</code></td><td>System Buttons</td><td>USB byte 10</td></tr>
          <tr><td><code>12–16</code></td><td>Reserved</td><td>USB bytes 11–15</td></tr>
          <tr><td><code>17–22</code></td><td>Gyroscope X/Y/Z</td><td>USB bytes 16–21</td></tr>
          <tr><td><code>23–28</code></td><td>Accelerometer X/Y/Z</td><td>USB bytes 22–27</td></tr>
          <tr><td><code>29–33</code></td><td>Sensor Timestamp + Reserved</td><td>USB bytes 28–32</td></tr>
          <tr><td><code>34–41</code></td><td>Touchpad (2 contacts)</td><td>USB bytes 33–40</td></tr>
          <tr><td><code>42–53</code></td><td>Reserved</td><td>USB bytes 41–52</td></tr>
          <tr><td><code>54</code></td><td>Battery</td><td>USB byte 53</td></tr>
          <tr><td><code>55</code></td><td>Status Flags</td><td>USB byte 54</td></tr>
          <tr><td><code>56–77</code></td><td>Reserved / Padding</td><td>—</td></tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Output Report ──────────────────────────────────────── */}

    <SectionHeading>Output Report — USB (0x02)</SectionHeading>
    <Prose>
      <p>
        48-byte report that controls rumble, LEDs, triggers, and audio. The
        library batches pending changes and sends them in the HID command
        flush loop (default 30 Hz). Two scope bytes at the front tell the
        controller which subsystems are being updated.
      </p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID</td><td><code>0x02</code></td></tr>
          <tr><td><code>1</code></td><td>Scope A</td><td>Bitfield — which subsystems to update</td></tr>
          <tr><td><code>2</code></td><td>Scope B</td><td>Bitfield — additional subsystems</td></tr>
          <tr><td><code>3</code></td><td>Right Rumble</td><td>0–255 intensity</td></tr>
          <tr><td><code>4</code></td><td>Left Rumble</td><td>0–255 intensity</td></tr>
          <tr><td><code>5</code></td><td>Headphone Volume</td><td>0x00–0x7F</td></tr>
          <tr><td><code>6</code></td><td>Speaker Volume</td><td>0x00–0x64 (effective range 0x3D–0x64)</td></tr>
          <tr><td><code>7</code></td><td>Microphone Volume</td><td>0x00–0x40</td></tr>
          <tr><td><code>8</code></td><td>Audio Flags</td><td>Mic source, output routing, mic mode (see below)</td></tr>
          <tr><td><code>9</code></td><td>Mute LED Mode</td><td>0=Off, 1=On, 2=Pulse</td></tr>
          <tr><td><code>10</code></td><td>Power Save</td><td>Per-subsystem mute/disable bitfield</td></tr>
          <tr><td><code>11–21</code></td><td>Right Trigger Effect</td><td>1 byte mode + 10 bytes parameters</td></tr>
          <tr><td><code>22–32</code></td><td>Left Trigger Effect</td><td>1 byte mode + 10 bytes parameters</td></tr>
          <tr><td><code>33–36</code></td><td>Reserved</td><td>Must be 0x00</td></tr>
          <tr><td><code>37</code></td><td>Audio Flags 2</td><td>Bits 0–2: preamp gain (0–7), Bit 4: beam forming</td></tr>
          <tr><td><code>38</code></td><td>Reserved</td><td></td></tr>
          <tr><td><code>39</code></td><td>LED Options</td><td>0x0=Off, 0x1=PlayerLedBrightness, 0x2=Uninterruptible</td></tr>
          <tr><td><code>40–41</code></td><td>Reserved</td><td></td></tr>
          <tr><td><code>42</code></td><td>Pulse Options</td><td>0=Off, 1=FadeBlue, 2=FadeOut</td></tr>
          <tr><td><code>43</code></td><td>LED Brightness</td><td>0x0=High, 0x1=Medium, 0x2=Low</td></tr>
          <tr><td><code>44</code></td><td>Player LEDs</td><td>5-bit bitmask (bits 0–4, one per LED)</td></tr>
          <tr><td><code>45</code></td><td>Lightbar Red</td><td>0–255</td></tr>
          <tr><td><code>46</code></td><td>Lightbar Green</td><td>0–255</td></tr>
          <tr><td><code>47</code></td><td>Lightbar Blue</td><td>0–255</td></tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Scope Flags ────────────────────────────────────────── */}

    <SectionHeading>Command Scope Flags</SectionHeading>
    <Prose>
      <p>
        The two scope bytes tell the controller which parts of the output
        report contain active commands. Only subsystems with their scope bit
        set will be updated — the rest are ignored.
      </p>
      <p><strong>Scope A (byte 1):</strong></p>
      <table>
        <thead>
          <tr>
            <th>Bit</th>
            <th>Flag</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0x01</code></td><td>HapticRumble</td><td>Rumble effect updates</td></tr>
          <tr><td><code>0x02</code></td><td>PrimaryRumble</td><td>Primary rumble motor control</td></tr>
          <tr><td><code>0x04</code></td><td>RightTriggerFeedback</td><td>R2 adaptive trigger effect</td></tr>
          <tr><td><code>0x08</code></td><td>LeftTriggerFeedback</td><td>L2 adaptive trigger effect</td></tr>
          <tr><td><code>0x10</code></td><td>HeadphoneVolume</td><td>Headphone volume (byte 5)</td></tr>
          <tr><td><code>0x20</code></td><td>SpeakerVolume</td><td>Speaker volume (byte 6)</td></tr>
          <tr><td><code>0x40</code></td><td>MicrophoneVolume</td><td>Mic volume (byte 7)</td></tr>
          <tr><td><code>0x80</code></td><td>AudioFlags</td><td>Audio routing + mic mode (byte 8)</td></tr>
        </tbody>
      </table>
      <p><strong>Scope B (byte 2):</strong></p>
      <table>
        <thead>
          <tr>
            <th>Bit</th>
            <th>Flag</th>
            <th>Controls</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0x01</code></td><td>MicrophoneLED</td><td>Mute LED mode (byte 9)</td></tr>
          <tr><td><code>0x02</code></td><td>PowerSave</td><td>Subsystem mute/disable (byte 10)</td></tr>
          <tr><td><code>0x04</code></td><td>TouchpadLeds</td><td>Lightbar RGB (bytes 45–47)</td></tr>
          <tr><td><code>0x08</code></td><td>DisableLeds</td><td>Kill all LEDs</td></tr>
          <tr><td><code>0x10</code></td><td>PlayerLeds</td><td>Player indicators + brightness</td></tr>
          <tr><td><code>0x40</code></td><td>MotorPower</td><td>Motor enable/disable</td></tr>
          <tr><td><code>0x80</code></td><td>AudioFlags2</td><td>Preamp gain + beam forming (byte 37)</td></tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Audio Flags ────────────────────────────────────────── */}

    <SectionHeading>Audio Flags (Byte 8)</SectionHeading>
    <Prose>
      <p>
        A packed byte combining microphone source selection, audio output
        routing, and microphone input mode.
      </p>
      <table>
        <thead>
          <tr>
            <th>Bits</th>
            <th>Field</th>
            <th>Values</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>0–1</td>
            <td>MicSelect</td>
            <td><code>0x01</code>=Internal, <code>0x02</code>=Headset</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Echo Cancellation</td>
            <td><code>0x04</code> when enabled</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Noise Cancellation</td>
            <td><code>0x08</code> when enabled</td>
          </tr>
          <tr>
            <td>4–5</td>
            <td>AudioOutput</td>
            <td>
              <code>0x00</code>=Headphone stereo,{" "}
              <code>0x10</code>=Headphone mono,{" "}
              <code>0x20</code>=Split (L→headphone, R→speaker),{" "}
              <code>0x30</code>=Speaker only
            </td>
          </tr>
          <tr>
            <td>6–7</td>
            <td>MicMode</td>
            <td><code>0x00</code>=Default, <code>0x40</code>=Chat, <code>0x80</code>=ASR</td>
          </tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Power Save ─────────────────────────────────────────── */}

    <SectionHeading>Power Save (Byte 10)</SectionHeading>
    <Prose>
      <p>
        Per-subsystem mute and disable flags. Multiple flags can be combined.
      </p>
      <table>
        <thead>
          <tr>
            <th>Bit</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0x01</code></td><td>DisableTouch</td></tr>
          <tr><td><code>0x02</code></td><td>DisableMotion</td></tr>
          <tr><td><code>0x04</code></td><td>DisableHaptics</td></tr>
          <tr><td><code>0x08</code></td><td>DisableAudio</td></tr>
          <tr><td><code>0x10</code></td><td>MuteMicrophone</td></tr>
          <tr><td><code>0x20</code></td><td>MuteSpeaker</td></tr>
          <tr><td><code>0x40</code></td><td>MuteHeadphone</td></tr>
          <tr><td><code>0x80</code></td><td>MuteHaptics</td></tr>
        </tbody>
      </table>
    </Prose>

    {/* ── Output Report BT ───────────────────────────────────── */}

    <SectionHeading>Output Report — Bluetooth (0x31)</SectionHeading>
    <Prose>
      <p>
        The Bluetooth output report wraps the USB payload with a different
        report ID, a constant prefix byte, shifted offsets, and a trailing
        CRC-32 checksum.
      </p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID (<code>0x31</code>)</td></tr>
          <tr><td><code>1</code></td><td>Constant (<code>0x02</code>)</td></tr>
          <tr><td><code>2</code></td><td>Scope A (= USB byte 1)</td></tr>
          <tr><td><code>3</code></td><td>Scope B (= USB byte 2)</td></tr>
          <tr><td><code>4–48</code></td><td>Payload (= USB bytes 3–47, shifted +1)</td></tr>
          <tr><td><code>49–73</code></td><td>Padding</td></tr>
          <tr><td><code>74–77</code></td><td>CRC-32 checksum (uint32 LE)</td></tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`// Building a Bluetooth output report from USB
const btReport = new Uint8Array(78);
btReport[0] = 0x31;                    // Report ID
btReport[1] = 0x02;                    // Constant
btReport[2] = usbReport[1];            // Scope A
btReport[3] = usbReport[2];            // Scope B
for (let i = 3; i < 48; i++) {
  btReport[i + 1] = usbReport[i];      // Payload shifted +1
}

const crc = computeBluetoothReportChecksum(btReport);
btReport[74] = crc & 0xff;             // CRC LE
btReport[75] = (crc >>> 8) & 0xff;
btReport[76] = (crc >>> 16) & 0xff;
btReport[77] = (crc >>> 24) & 0xff;`}
    />

    {/* ── CRC ────────────────────────────────────────────────── */}

    <SectionHeading>Bluetooth CRC</SectionHeading>
    <Prose>
      <p>
        Bluetooth output reports require a 32-bit checksum at bytes 74–77.
        Two different CRC algorithms are used depending on the report type.
      </p>
      <p>
        <strong>Output report (0x31):</strong> Uses a custom 256-entry hash
        table (not standard CRC-32). Processes bytes 0–73. Initial
        seed: <code>0xEADA2D49</code>.
      </p>
    </Prose>
    <CodeBlock
      code={`function computeBluetoothReportChecksum(buffer: Uint8Array): number {
  let result = 0xeada2d49 >>> 0;
  for (let i = 0; i < 74; i++) {
    const idx = ((result & 0xff) ^ (buffer[i] & 0xff)) & 0xff;
    result = (hashTable[idx] ^ (result >>> 8)) >>> 0;
  }
  return result >>> 0;
}`}
    />
    <Prose>
      <p>
        <strong>Feature reports (0x80):</strong> Standard CRC-32 (polynomial{" "}
        <code>0xEDB88320</code>) with two prefix bytes before the payload:
        the HID transaction header (<code>0x53</code> for SET_REPORT) and the
        report ID. Final value is XOR'd with <code>0xFFFFFFFF</code>.
      </p>
    </Prose>
    <CodeBlock
      code={`function computeFeatureReportChecksum(
  reportId: number,
  buffer: Uint8Array,
): number {
  let crc = 0xffffffff >>> 0;
  crc = (crc >>> 8) ^ crc32Table[(crc ^ 0x53) & 0xff]; // SET_REPORT
  crc = (crc >>> 8) ^ crc32Table[(crc ^ reportId) & 0xff];
  for (let i = 0; i < buffer.length - 4; i++) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ buffer[i]) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}`}
    />

    {/* ── Feature Report 0x05 ────────────────────────────────── */}

    <SectionHeading>Feature Report 0x05 — Bluetooth Enable</SectionHeading>
    <Prose>
      <p>
        Reading this 41-byte feature report over Bluetooth causes the
        controller to switch from the limited 10-byte input report (0x01) to
        the full 78-byte report (0x31). No parsing is required — the act of
        reading it is the trigger.
      </p>
    </Prose>
    <CodeBlock
      code={`// WebHID
await device.receiveFeatureReport(0x05);

// node-hid
device.getFeatureReport(0x05, 41);`}
    />

    {/* ── Feature Report 0x09 ────────────────────────────────── */}

    <SectionHeading>Feature Report 0x09 — Pairing Info</SectionHeading>
    <Prose>
      <p>
        20-byte feature report containing the controller's Bluetooth MAC
        address. Works over both USB and Bluetooth on all platforms. The MAC
        is stored in little-endian order at bytes 1–6.
      </p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID (<code>0x09</code>)</td></tr>
          <tr><td><code>1–6</code></td><td>MAC Address (6 bytes, little-endian)</td></tr>
          <tr><td><code>7–19</code></td><td>Reserved</td></tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`// Reading the MAC address
const data = await provider.readFeatureReport(0x09, 20);
const mac: string[] = [];
for (let i = 6; i >= 1; i--) {
  mac.push(data[i].toString(16).padStart(2, "0"));
}
console.log(mac.join(":")); // "AA:BB:CC:DD:EE:FF"`}
    />

    {/* ── Feature Report 0x20 ────────────────────────────────── */}

    <SectionHeading>Feature Report 0x20 — Firmware Info</SectionHeading>
    <Prose>
      <p>
        64-byte feature report containing firmware build info, version
        numbers, and hardware identifiers. Read automatically on connection
        and exposed via{" "}
        <Link to="/status">
          <code>controller.firmwareInfo</code>
        </Link>.
      </p>
      <table>
        <thead>
          <tr>
            <th>Offset</th>
            <th>Length</th>
            <th>Field</th>
            <th>Format</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>1</code></td><td>11</td><td>Build Date</td><td>ASCII, null-terminated (e.g. "Apr 14 2023")</td></tr>
          <tr><td><code>12</code></td><td>8</td><td>Build Time</td><td>ASCII (e.g. "12:34:56")</td></tr>
          <tr><td><code>20</code></td><td>2</td><td>Firmware Type</td><td>uint16 LE (2 or 3 = production)</td></tr>
          <tr><td><code>22</code></td><td>2</td><td>Software Series</td><td>uint16 LE</td></tr>
          <tr><td><code>24</code></td><td>4</td><td>Hardware Info</td><td>uint32 LE (low 16 bits for feature gating)</td></tr>
          <tr><td><code>28</code></td><td>4</td><td>Main FW Version</td><td>uint32 LE → major.minor.patch</td></tr>
          <tr><td><code>32</code></td><td>12</td><td>Device Info</td><td>Raw bytes → hex string</td></tr>
          <tr><td><code>44</code></td><td>2</td><td>Update Version</td><td>uint16 LE → HH.LL hex</td></tr>
          <tr><td><code>46</code></td><td>1</td><td>Update Image Info</td><td>uint8</td></tr>
          <tr><td><code>48</code></td><td>4</td><td>SBL FW Version</td><td>uint32 LE → major.minor.patch</td></tr>
          <tr><td><code>52</code></td><td>4</td><td>DSP FW Version</td><td>uint32 LE → HHHH_LLLL hex</td></tr>
          <tr><td><code>56</code></td><td>4</td><td>Spider DSP Version</td><td>uint32 LE → major.minor.patch</td></tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`// Firmware version parsing
function parseVersion(ver: number): FirmwareVersion {
  return {
    major: (ver >>> 24) & 0xff,
    minor: (ver >>> 16) & 0xff,
    patch: ver & 0xffff,
  };
}`}
    />

    {/* ── Feature Reports 0x80/0x81 ──────────────────────────── */}

    <SectionHeading>Feature Reports 0x80 / 0x81 — Test Commands</SectionHeading>
    <Prose>
      <p>
        The test command protocol provides access to the DSP subsystem and
        factory data. Report 0x80 sends a command; report 0x81 is polled for
        the response. Both are 64-byte feature reports.
      </p>
      <p><strong>Send report (0x80):</strong></p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID (<code>0x80</code>)</td></tr>
          <tr><td><code>1</code></td><td>Device ID</td></tr>
          <tr><td><code>2</code></td><td>Action ID</td></tr>
          <tr><td><code>3+</code></td><td>Action-specific parameters</td></tr>
        </tbody>
      </table>
      <p><strong>Receive report (0x81):</strong></p>
      <table>
        <thead>
          <tr>
            <th>Byte</th>
            <th>Field</th>
          </tr>
        </thead>
        <tbody>
          <tr><td><code>0</code></td><td>Report ID (<code>0x81</code>)</td></tr>
          <tr><td><code>1</code></td><td>Response Device ID (echoes request)</td></tr>
          <tr><td><code>2</code></td><td>Response Action ID (echoes request)</td></tr>
          <tr><td><code>3</code></td><td>Status (<code>0x02</code> = complete)</td></tr>
          <tr><td><code>4+</code></td><td>Response data</td></tr>
        </tbody>
      </table>
    </Prose>
    <Prose>
      <p><strong>Known device/action pairs:</strong></p>
      <table>
        <thead>
          <tr>
            <th>Device</th>
            <th>Action</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><code>0x01</code> (System)</td>
            <td><code>0x13</code> (ReadSerial)</td>
            <td>
              Factory info — returns 32-byte ASCII serial number encoding
              board revision, body color, and unique ID
            </td>
          </tr>
          <tr>
            <td><code>0x06</code> (Audio DSP)</td>
            <td><code>0x02</code> (Waveout)</td>
            <td>
              Start/stop test tones. Byte 3: start (1) or stop (0),
              Byte 4: 100Hz enable, Byte 5: 1kHz enable
            </td>
          </tr>
          <tr>
            <td><code>0x06</code> (Audio DSP)</td>
            <td><code>0x04</code> (Configure)</td>
            <td>
              Configure output routing before tone playback. Byte 5:
              speaker config, Byte 7: audio output mode
            </td>
          </tr>
        </tbody>
      </table>
    </Prose>
    <CodeBlock
      code={`// Example: reading factory serial number
const sendBuf = new Uint8Array(64);
sendBuf[0] = 0x80; // Report ID
sendBuf[1] = 0x01; // Device: System
sendBuf[2] = 0x13; // Action: ReadSerial
await provider.sendFeatureReport(0x80, sendBuf);

// Poll for response
const response = await provider.readFeatureReport(0x81, 64);
// response[3] === 0x02 means complete
// response[4..35] contains the serial number as ASCII`}
    />

    {/* ── Mapping Functions ──────────────────────────────────── */}

    <SectionHeading>Mapping Functions</SectionHeading>
    <Prose>
      <p>
        Raw HID byte values are converted to normalized ranges using these
        functions:
      </p>
    </Prose>
    <CodeBlock
      code={`// Analog sticks: 0–255 → -1…1
function mapAxis(value: number, max = 255): number {
  return (2 / max) * Math.max(0, Math.min(max, value)) - 1;
}

// Triggers: 0–255 → 0…1
function mapTrigger(value: number): number {
  return (1 / 255) * Math.max(0, Math.min(255, value));
}

// Gyro/accel: two bytes → signed int16 → -1…1
function mapGyroAccel(v0: number, v1: number): number {
  let v = (v1 << 8) | v0;
  if (v > 0x7fff) v -= 0x10000;
  return mapAxis(v + 0x7fff, 0xffff);
}

// Battery: low nibble 0–10 → 0.0…1.0
function mapBatteryLevel(value: number): number {
  return Math.min(1, Math.max(0, (value & 0xf) / 10));
}

// Touchpad: 12-bit packed coordinates
// X: (uint16LE << 20) >> 20, max 1920
// Y: uint16LE >> 4, max 1080`}
    />

    {/* ── Device Identification ──────────────────────────────── */}

    <SectionHeading>Device Identification</SectionHeading>
    <Prose>
      <p>
        The DualSense uses USB vendor ID <code>0x054C</code> (Sony) and
        product ID <code>0x0CE6</code>. HID usage page is{" "}
        <code>0x0001</code> (Generic Desktop) with usage{" "}
        <code>0x0005</code> (Gamepad). The transport type is detected by
        whether the device's interface number is -1 (Bluetooth) or &ge; 0
        (USB).
      </p>
    </Prose>
    <CodeBlock
      code={`// Device identification constants
const VENDOR_ID  = 0x054C; // 1356 — Sony Interactive Entertainment
const PRODUCT_ID = 0x0CE6; // 3302 — DualSense Wireless Controller
const USAGE_PAGE = 0x0001; // Generic Desktop
const USAGE      = 0x0005; // Gamepad`}
    />
  </FeaturePage>
);

export default HidReportsPage;
