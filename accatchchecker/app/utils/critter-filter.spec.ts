import {filterAllCritters} from "./critter-filter";
import {Hemispheres} from "@/app/constants/hemispheres";

describe("filterAllCritters", () => {
    describe('when the user selects northern hemisphere', () => {
        describe('when filtering insects', () => {
            it("shows insects available at a specific time", () => {
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
            });
            it("does not show insects that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterAllCritters(date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.insects.map(c => c.Name)).not.toContain(["common butterfly"]);
            });
        })

        describe('when filtering fish', () => {
            it("shows fish available at a specific time", () => {
                const date = new Date("2024-01-15T10:00:00");

                const result = filterAllCritters(date, Hemispheres.NORTHERN_HEMISPHERE);

                console.log(result)

                expect(result.fish.map(c => c.Name)).toEqual([
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
            it("does not show fish that should not appear in the list", () => {
                const date = new Date("2024-01-15T02:00:00");

                const result = filterAllCritters(date, Hemispheres.NORTHERN_HEMISPHERE);

                expect(result.fish.map(c => c.Name)).not.toContain(["common butterfly"]);
            });
        })



    })

    describe('when the user selects southern hemisphere', () => {
        it("filters critters available at a specific time", () => {
            const date = new Date("2024-01-15T10:00:00"); // Jan 10 AM

            const result = filterAllCritters(date, "SH");

            expect(result.insects.map(c => c.Name)).toEqual(["Butterfly", "Moth"]); // Butterfly 8–5, Moth all day
            expect(result.fish).toEqual([]); // Goldfish only at night
        });

        it("handles overnight time ranges", () => {
            const date = new Date("2024-01-15T02:00:00"); // 2 AM

            const result = filterAllCritters(date, "SH");

            expect(result.fish.map(c => c.Name)).toEqual(["Goldfish"]); // 9 PM – 4 AM
            expect(result.insects.map(c => c.Name)).toEqual(["Moth"]); // Butterfly asleep
        });

        it("returns empty array when month is NA", () => {
            const date = new Date("2024-02-01T12:00:00");

            const result = filterAllCritters(date, "SH");

            expect(result.insects.map(c => c.Name)).toEqual(["Moth"]); // Butterfly NA in Feb
        });
    })

});
