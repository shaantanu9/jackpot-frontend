import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import SpinCard from "../components/SpinCard";
import { useFingerprint } from "../lib/api/hooks/useFingerprint";
import * as api from "../lib/api/slotmachine";

jest.mock("../lib/api/hooks/useFingerprint", () => ({
  useFingerprint: jest.fn(),
}));

// jest.mock("../lib/api/gameslot.api", () => ({
//   rollGameSlot: jest.fn() as jest.MockedFunction<any>,
//   getGameSlot: jest.fn() as jest.MockedFunction<any>,
//   cashOutGameSlot: jest.fn() as jest.MockedFunction<any>,
// }));
jest.mock("../lib/api/slotmachine", () => ({
  rollGameSlot: jest.fn() as jest.MockedFunction<typeof api.rollGameSlot>,
  getGameSlot: jest.fn() as jest.MockedFunction<typeof api.getGameSlot>,
  cashOutGameSlot: jest.fn() as jest.MockedFunction<typeof api.cashOutGameSlot>,
}));

describe("SpinCard", () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.useRealTimers(); // Restore real timers after tests
  });

//   // Set up initial credits for each test
  beforeEach(() => {
    api.getGameSlot.mockResolvedValueOnce({
      statusCode: 200,
      data: { credits: 50 }, // Set initial credits here
    });

    useFingerprint.mockReturnValue("123");
  });

//   // initial credits
  it("should render the SpinCard component", async () => {
    // useFingerprint.mockReturnValue("123");
    render(<SpinCard />);
//     expect(api.getGameSlot).toHaveBeenCalledTimes(1);

//     // expect the initial credits to be displayed
//     const credit = await screen.findByTestId("credits");

//     expect(credit).toHaveTextContent("50");
  });

//   it("spin the slot machine and display results", async () => {
//     useFingerprint.mockReturnValue("123");
//     api.rollGameSlot.mockResolvedValueOnce({
//       statusCode: 200,
//       data: { symbols: ["C", "L", "O"], updatedCredit: 30 },
//     });

//     render(<SpinCard />);

//     expect(api.getGameSlot).toHaveBeenCalledTimes(2);
//     const credit = await screen.findByTestId("credits");
//     expect(credit).toHaveTextContent("50");
//     jest.useFakeTimers();

//     fireEvent.click(screen.getByTestId("spin"));

//     await waitFor(() =>
//       expect(screen.getByTestId("spin")).toHaveTextContent("Spinning...")
//     );

//     await act(async () => {
//       jest.advanceTimersByTime(1000);
//     });
//     // Check the first symbol
//     await waitFor(() => {
//       const slot = screen.getByTestId("slot-0");
//       expect(slot).toHaveTextContent("C");
//     });

//     await act(async () => {
//       jest.advanceTimersByTime(1000);
//     });

//     await waitFor(() => {
//       const slot = screen.getByTestId("slot-1");
//       expect(slot).toHaveTextContent("L");
//     });

//     await act(async () => {
//       jest.advanceTimersByTime(1000);
//     });

//     await waitFor(() => {
//       const slot = screen.getByTestId("slot-2");
//       expect(slot).toHaveTextContent("O");
//     });

//     //spinning stop
//     await waitFor(() => {
//       expect(screen.getByTestId("spin")).not.toHaveTextContent("Spinning...");
//     });

//     // Credit Updated
//     const credits = screen.getByTestId("credits");
//     expect(credits).toHaveTextContent("30");
//   });

//   it("handle error when spinning", async () => {
//     useFingerprint.mockReturnValue("123");
//     api.rollGameSlot.mockRejectedValueOnce(new Error("Server error"));

//     render(<SpinCard />);

//     await act(async () => {
//       jest.useFakeTimers();
//     });

//     fireEvent.click(screen.getByTestId("spin"));

//     await waitFor(() =>
//       expect(screen.getByTestId("spin")).toHaveTextContent("Spinning...")
//     );

//     await act(async () => {
//       jest.advanceTimersByTime(1000);
//     });

//     await waitFor(() => {
//       expect(screen.getByTestId("message")).toHaveTextContent(
//         "Error: Couldn't connect to the server"
//       );
//     });

//     // Spin button should be enabled
//     expect(screen.getByTestId("spin")).not.toHaveTextContent("Spinning...");
//   });

//   it("cash out the credits", async () => {
//     useFingerprint.mockReturnValue("123");
//     api.cashOutGameSlot.mockResolvedValueOnce({
//       statusCode: 200,
//     });

//     // Mock the alert function
//     const alertMock = jest.spyOn(window, "alert").mockImplementation(() => {});

//     render(<SpinCard />);

//     await act(async () => {
//       jest.advanceTimersByTime(1000);
//     });
//     // expect(api.getGameSlot).toHaveBeenCalledTimes(4);
//     // const credit = await screen.findByTestId("credits");
//     // expect(credit).toHaveTextContent("50");

//     const cashout = await screen.getByTestId("cashout");

//     expect(cashout).not.toBeDisabled();

//     await act(async () => {
//       fireEvent.click(cashout);
//     });

//     const alterMessage = alertMock.mock.calls[0][0];
//     expect(alterMessage).toBe("Cashing out 50 credits!");

//     expect(api.cashOutGameSlot).toHaveBeenCalledTimes(1);

//     // credits should be zero
//     const credits = screen.getByTestId("credits");
//     expect(credits).toHaveTextContent("0");
//     alertMock.mockRestore();
//   });
});
