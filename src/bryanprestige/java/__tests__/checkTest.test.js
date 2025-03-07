/* eslint-disable no-undef */

import { multiplicate,toUpperCase,onFilterButtonClick } from "../checkTest.js";

/*=====TEST toUpperCase=====*/ 
describe("we are testing if the string is covnerted to upper cAse", () => {
  it("should convert 'dance' to 'DANCE'", () => {
      expect(toUpperCase("dance")).toBe("DANCE");
  });
});

/*=====TEST multiplicate=====*/
describe("we are testing that the math operation is correctly resolved", () => {
  it('Should multiply two numbers', () => {
    expect(multiplicate(1, 2)).toBe(2)
    expect(multiplicate(2, 2)).toBe(4)
    expect(multiplicate(3, 7)).toBe(21) 
  })
})

/*=====TEST onFilterButtonClick=====*/

describe('we are testing if it filters teh data correctly', () => {
  const events = [
    {name: "Bachata Exchange"},
    {name: "Salsa Fusion"},
    {name: "Kizomba Town"}
  ]

  it('should return dance events that match the filter value "bachata"', () => {
    expect(onFilterButtonClick(events, "bachata")).toEqual([{name: "Bachata Exchange"}]);
  })

  it('should return dance events that match the filter value "salsa"', () => {
    expect(onFilterButtonClick(events, "salsa")).toEqual([{name: "Salsa Fusion"}]);
  })

  it('should return dance events that match the filter value "kizomba"', () => {
    expect(onFilterButtonClick(events, "kizomba")).toEqual([{name: "Kizomba Town"}]);
  })
})
