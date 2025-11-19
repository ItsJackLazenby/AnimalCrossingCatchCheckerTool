import {filterAllCritters, filterCategory, to24HourFormat} from "./critter-filter";
import {Hemispheres} from "@/app/constants/hemispheres";
import {ALL_DATA} from "@/app/data";

describe('filterAllCritters', () => {
    describe('when it is called', () => {
        it('should return all valid results for the three different critter types', () => {
            const date = new Date("2024-01-15T10:00:00");

            const result = filterAllCritters(date, Hemispheres.NORTHERN_HEMISPHERE);

            expect(result.insects.map(c => c.Name)).toEqual([
                "ant",
                "bagworm",
                "citrus long-horned beetle",
                "common butterfly",
                "damselfly",
                "dung beetle",
                "fly",
                "mole cricket",
                "paper kite butterfly",
                "pill bug",
                "Rajah Brooke's birdwing",
                "snail",
                "wasp",
                "wharf roach"
            ]);

            expect(result.fish.map(c => c.Name)).toEqual([
                "anchovy",
                "bitterling",
                "black bass",
                "blue marlin",
                "bluegill",
                "carp",
                "coelacanth",
                "crucian carp",
                "dab",
                "goldfish",
                "horse mackerel",
                "oarfish",
                "olive flounder",
                "pale chub",
                "pond smelt",
                "pop-eyed goldfish",
                "ranchu goldfish",
                "red snapper",
                "sea bass",
                "sea butterfly",
                "squid",
                "sturgeon",
                "tuna",
                "yellow perch"
            ]);

            expect(result.seaCreatures.map(c => c.Name)).toEqual([
                "acorn barnacle",
                "Dungeness crab",
                "lobster",
                "octopus",
                "oyster",
                "pearl oyster",
                "red king crab",
                "scallop",
                "sea anemone",
                "sea cucumber",
                "sea slug",
                "sea star",
                "seaweed",
                "snow crab",
                "Venus' flower basket",
                "whelk"
            ]);
        })
    })
})

describe("filterCategory", () => {
    describe('when the user selects northern hemisphere', () => {
        describe('when filtering insects', () => {
            it("shows insects available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterCategory(ALL_DATA.insects, date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).toEqual([
                    "ant",
                    "bagworm",
                    "citrus long-horned beetle",
                    "common butterfly",
                    "damselfly",
                    "dung beetle",
                    "fly",
                    "mole cricket",
                    "paper kite butterfly",
                    "pill bug",
                    "Rajah Brooke's birdwing",
                    "snail",
                    "wasp",
                    "wharf roach"
                ]);
            });
            it("does not show insects that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterCategory(ALL_DATA.insects, date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).not.toContain(["common butterfly"]);
            });
        })

        describe('when filtering fish', () => {
            it("shows fish available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterCategory(ALL_DATA.fish, date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).toEqual([
                    "anchovy",
                    "bitterling",
                    "black bass",
                    "blue marlin",
                    "bluegill",
                    "carp",
                    "coelacanth",
                    "crucian carp",
                    "dab",
                    "goldfish",
                    "horse mackerel",
                    "oarfish",
                    "olive flounder",
                    "pale chub",
                    "pond smelt",
                    "pop-eyed goldfish",
                    "ranchu goldfish",
                    "red snapper",
                    "sea bass",
                    "sea butterfly",
                    "squid",
                    "sturgeon",
                    "tuna",
                    "yellow perch"
                ]);
            });
            it("does not show fish that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterCategory(ALL_DATA.fish, date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).not.toContain(["squid"]);
            });
        })

        describe('when filtering sea creatures', () => {
            it("shows sea creatures available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterCategory(ALL_DATA.seaCreatures, date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).toEqual([
                    "acorn barnacle",
                    "Dungeness crab",
                    "lobster",
                    "octopus",
                    "oyster",
                    "pearl oyster",
                    "red king crab",
                    "scallop",
                    "sea anemone",
                    "sea cucumber",
                    "sea slug",
                    "sea star",
                    "seaweed",
                    "snow crab",
                    "Venus' flower basket",
                    "whelk"
                ]);
            });
            it("does not show sea creatures that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterCategory(ALL_DATA.seaCreatures, date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).not.toContain(["lobster"]);
            });
        })
    })

    describe('when the user selects southern hemisphere', () => {
        describe('when filtering insects', () => {
            it("shows insects available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterCategory(ALL_DATA.insects, date, Hemispheres.SOUTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).toEqual([
                    "agrias butterfly",
                    "ant",
                    "bagworm",
                    "banded dragonfly",
                    "blue weevil beetle",
                    "brown cicada",
                    "cicada shell",
                    "citrus long-horned beetle",
                    "common bluebottle",
                    "darner dragonfly",
                    "diving beetle",
                    "drone beetle",
                    "earth-boring dung beetle",
                    "flea",
                    "fly",
                    "giant cicada",
                    "grasshopper",
                    "great purple emperor",
                    "honeybee",
                    "jewel beetle",
                    "long locust",
                    "Madagascan sunset moth",
                    "mantis",
                    "miyama stag",
                    "orchid mantis",
                    "paper kite butterfly",
                    "pondskater",
                    "Queen Alexandra's birdwing",
                    "Rajah Brooke's birdwing",
                    "robust cicada",
                    "rosalia batesi beetle",
                    "saw stag",
                    "snail",
                    "stinkbug",
                    "tiger beetle",
                    "tiger butterfly",
                    "walking leaf",
                    "wasp",
                    "wharf roach"
                ]);
            });
            it("does not show insects that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterCategory(ALL_DATA.insects, date, Hemispheres.SOUTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).not.toContain(["common butterfly"]);
            });
        })

        describe('when filtering fish', () => {
            it("shows fish available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterCategory(ALL_DATA.fish, date, Hemispheres.SOUTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).toEqual([
                    "anchovy",
                    "barred knifejaw",
                    "betta",
                    "black bass",
                    "blue marlin",
                    "bluegill",
                    "butterfly fish",
                    "carp",
                    "clown fish",
                    "coelacanth",
                    "crawfish",
                    "crucian carp",
                    "dorado",
                    "frog",
                    "giant snakehead",
                    "giant trevally",
                    "goldfish",
                    "guppy",
                    "horse mackerel",
                    "killifish",
                    "mahi-mahi",
                    "Napoleonfish",
                    "neon tetra",
                    "nibble fish",
                    "ocean sunfish",
                    "olive flounder",
                    "pale chub",
                    "piranha",
                    "pop-eyed goldfish",
                    "puffer fish",
                    "rainbowfish",
                    "ranchu goldfish",
                    "red snapper",
                    "ribbon eel",
                    "sea bass",
                    "sea horse",
                    "squid",
                    "suckerfish",
                    "surgeonfish",
                    "sweetfish",
                    "tadpole",
                    "tilapia",
                    "whale shark",
                    "zebra turkeyfish"
                ]);
            });
            it("does not show fish that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterCategory(ALL_DATA.fish, date, Hemispheres.SOUTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).not.toContain(["squid"]);
            });
        })

        describe('when filtering sea creatures', () => {
            it("shows sea creatures available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterCategory(ALL_DATA.seaCreatures, date, Hemispheres.SOUTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).toEqual([
                    "acorn barnacle",
                    "gazami crab",
                    "giant isopod",
                    "gigas giant clam",
                    "moon jellyfish",
                    "mussel",
                    "octopus",
                    "pearl oyster",
                    "scallop",
                    "sea anemone",
                    "sea grapes",
                    "sea pineapple",
                    "sea slug",
                    "sea star",
                    "sea urchin",
                    "seaweed",
                    "spotted garden eel",
                    "whelk"
                ]);
            });
            it("does not show sea creatures that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterCategory(ALL_DATA.seaCreatures, date, Hemispheres.SOUTHERN_HEMISPHERE);

                expect(result.map(c => c.Name)).not.toContain(["lobster"]);
            });
        })
    })

    describe("to24HourFormat", () => {
        describe("when converting AM times", () => {
            it("converts regular AM hours correctly", () => {
                expect(to24HourFormat("1 AM")).toBe(1);
                expect(to24HourFormat("9 AM")).toBe(9);
            });

            it("converts 12 AM to hour 0", () => {
                expect(to24HourFormat("12 AM")).toBe(0);
            });

            it("converts AM times with minutes", () => {
                expect(to24HourFormat("8:30 AM")).toBeCloseTo(8.5);
                expect(to24HourFormat("11:45 AM")).toBeCloseTo(11.75);
            });
        });

        describe("when converting PM times", () => {
            it("adds 12 hours for PM times except 12 PM", () => {
                expect(to24HourFormat("1 PM")).toBe(13);
                expect(to24HourFormat("7 PM")).toBe(19);
            });

            it("leaves 12 PM as hour 12", () => {
                expect(to24HourFormat("12 PM")).toBe(12);
            });

            it("converts PM times with minutes", () => {
                expect(to24HourFormat("3:15 PM")).toBeCloseTo(15.25);
                expect(to24HourFormat("8:45 PM")).toBeCloseTo(20.75);
            });
        });

        describe("mixed formatting cases", () => {
            it("handles lowercase, uppercase, and mixed case input", () => {
                expect(to24HourFormat("10 am")).toBe(10);
                expect(to24HourFormat("10 Am")).toBe(10);
                expect(to24HourFormat("10 aM")).toBe(10);
                expect(to24HourFormat("10 AM")).toBe(10);

                expect(to24HourFormat("4 pm")).toBe(16);
                expect(to24HourFormat("4 Pm")).toBe(16);
                expect(to24HourFormat("4 pM")).toBe(16);
                expect(to24HourFormat("4 PM")).toBe(16);
            });
        });

        describe("edge cases", () => {
            it("handles midnight and noon correctly", () => {
                expect(to24HourFormat("12 AM")).toBe(0);
                expect(to24HourFormat("12 PM")).toBe(12);
            });

            it("parses times without minutes", () => {
                expect(to24HourFormat("5 PM")).toBe(17);
                expect(to24HourFormat("11 AM")).toBe(11);
            });

            it("parses minute values correctly", () => {
                expect(to24HourFormat("6:01 PM")).toBe(18.016666666666666);
                expect(to24HourFormat("6:59 PM")).toBe(18.983333333333334);
            });
        });
    });
});
