import {
  DualsenseColor,
  DualsenseColorMap,
  DefaultFactoryInfo,
} from "./factory_info";

describe("DualsenseColorMap", () => {
  it("maps '00' to White", () => {
    expect(DualsenseColorMap["00"]).toBe(DualsenseColor.White);
  });

  it("maps '02' to Cosmic Red", () => {
    expect(DualsenseColorMap["02"]).toBe(DualsenseColor.CosmicRed);
  });

  it("maps 'Z3' to Astro Bot", () => {
    expect(DualsenseColorMap.Z3).toBe(DualsenseColor.AstroBot);
  });

  it("maps '01' to Midnight Black", () => {
    expect(DualsenseColorMap["01"]).toBe(DualsenseColor.MidnightBlack);
  });

  it("maps '30' to 30th Anniversary", () => {
    expect(DualsenseColorMap["30"]).toBe(DualsenseColor.Anniversary30th);
  });

  it("does not contain unknown codes", () => {
    expect(DualsenseColorMap.XX).toBeUndefined();
    expect(DualsenseColorMap["99"]).toBeUndefined();
  });
});

describe("DefaultFactoryInfo", () => {
  it("has serialNumber 'unknown'", () => {
    expect(DefaultFactoryInfo.serialNumber).toBe("unknown");
  });

  it("has colorCode '??'", () => {
    expect(DefaultFactoryInfo.colorCode).toBe("??");
  });

  it("has colorName 'unknown'", () => {
    expect(DefaultFactoryInfo.colorName).toBe("unknown");
  });

  it("has boardRevision 'unknown'", () => {
    expect(DefaultFactoryInfo.boardRevision).toBe("unknown");
  });
});
